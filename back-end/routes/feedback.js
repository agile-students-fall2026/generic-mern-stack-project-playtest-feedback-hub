import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import multer from 'multer'
import projects from '../data/projects.js'
import feedback from '../data/feedback.js'
import { requireUser } from './auth.js'
import { projectResponse } from './projects.js'

const router = express.Router()

const categories = ['Bugs', 'Gameplay', 'Art', 'Audio', 'Other']
const statuses = ['Complete', 'Incomplete', 'WIP', 'Resolved', 'Assigned']
const maxTextLength = 2000
const maxImageUrls = 5
const maxUrlLength = 2048
const maxImageFiles = 5
const maxImageSize = 5 * 1024 * 1024
const imageTypes = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp' }

export const uploadsDir = fileURLToPath(new URL('../uploads', import.meta.url))

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxImageSize, files: maxImageFiles },
  fileFilter(req, file, cb) {
    if (Object.hasOwn(imageTypes, file.mimetype)) return cb(null, true)
    req.rejectedImageType = true
    cb(null, false)
  },
})

function findProject(id) {
  return projects.find((project) => project.id === id)
}

function feedbackResponse({ submitterId, ...item }) {
  return item
}

function findReceivedFeedback(id, userId) {
  const item = feedback.find((entry) => entry.id === id)
  if (item && findProject(item.projectId)?.ownerId === userId) return item
}

function requireProject(req, res, next) {
  if (!findProject(req.params.projectId)) return res.status(404).json({ error: 'Project not found.' })
  next()
}

function receiveImages(req, res, next) {
  upload.array('images')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: 'Each image must be 5 MB or smaller.',
        LIMIT_FILE_COUNT: `You can upload up to ${maxImageFiles} images.`,
      }
      return res.status(400).json({ error: messages[err.code] ?? 'Could not read the uploaded images.' })
    }
    if (err) return next(err)
    if (req.rejectedImageType) return res.status(400).json({ error: 'Images must be PNG, JPEG, GIF or WebP files.' })
    next()
  })
}

function readImageUrls(value) {
  if (value === undefined) return []
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

async function saveImages(files) {
  if (files.length === 0) return []
  await mkdir(uploadsDir, { recursive: true })
  return Promise.all(files.map(async (file) => {
    const name = `${randomUUID()}.${imageTypes[file.mimetype]}`
    await writeFile(path.join(uploadsDir, name), file.buffer)
    return `/uploads/${name}`
  }))
}

function isWebUrl(value) {
  if (typeof value !== 'string' || value.length > maxUrlLength) return false
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

router.get('/projects/:projectId', (req, res) => {
  const project = findProject(req.params.projectId)
  if (!project) return res.status(404).json({ error: 'Project not found.' })
  res.json(projectResponse(project))
})

router.get('/projects/:projectId/feedback', requireUser, (req, res) => {
  const { projectId } = req.params
  if (findProject(projectId)?.ownerId !== req.user.id) {
    return res.status(404).json({ error: 'Project not found.' })
  }
  res.json(feedback.filter((item) => item.projectId === projectId).map(feedbackResponse))
})

// A playtester sends feedback to a project.
router.post('/projects/:projectId/feedback', requireProject, receiveImages, async (req, res) => {
  const { projectId } = req.params
  const { category, feedback: text, anonymous = false, imageUrls: rawImageUrls } = req.body ?? {}
  const imageUrls = readImageUrls(rawImageUrls)
  // The form sends lowercase values like "bugs"; developer pages show "Bugs".
  const label = categories.find((name) => name.toLowerCase() === String(category).toLowerCase())
  if (!label) return res.status(400).json({ error: `Choose a valid category: ${categories.join(', ')}.` })
  if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: 'Feedback text is required.' })
  if (text.trim().length > maxTextLength) {
    return res.status(400).json({ error: `Feedback must be ${maxTextLength} characters or fewer.` })
  }
  if (!Array.isArray(imageUrls) || !imageUrls.every(isWebUrl)) {
    return res.status(400).json({ error: 'Image links must be http or https URLs.' })
  }
  if (imageUrls.length > maxImageUrls) {
    return res.status(400).json({ error: `You can add up to ${maxImageUrls} image links.` })
  }

  const uploadedImages = await saveImages(req.files ?? [])
  const item = {
    id: randomUUID(),
    projectId,
    submitterId: req.user?.id,
    category: label,
    author: anonymous === true || anonymous === 'true' ? 'Anonymous' : 'Playtester',
    submitted: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    status: 'Incomplete',
    text: text.trim(),
    images: [...uploadedImages, ...imageUrls],
  }
  feedback.push(item)
  res.status(201).json(feedbackResponse(item))
})

router.get('/feedback/mine', requireUser, (req, res) => {
  const items = feedback.filter((item) => item.submitterId === req.user.id).reverse()
  res.json(items.map((item) => {
    const project = findProject(item.projectId)
    return { ...feedbackResponse(item), gameName: project?.name, developer: project?.developer }
  }))
})

router.get('/feedback', requireUser, (req, res) => {
  const ownedProjects = new Map(
    projects.filter((project) => project.ownerId === req.user.id).map((project) => [project.id, project])
  )
  const items = feedback.filter((item) => ownedProjects.has(item.projectId)).reverse()
    .sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
  res.json(items.map((item) => ({
    ...feedbackResponse(item),
    gameName: ownedProjects.get(item.projectId).name,
  })))
})

router.get('/feedback/:feedbackId', requireUser, (req, res) => {
  const item = findReceivedFeedback(req.params.feedbackId, req.user.id)
  if (!item) return res.status(404).json({ error: 'Feedback not found.' })
  res.json(feedbackResponse(item))
})

router.patch('/feedback/:feedbackId', requireUser, (req, res) => {
  const item = findReceivedFeedback(req.params.feedbackId, req.user.id)
  if (!item) return res.status(404).json({ error: 'Feedback not found.' })
  const { status } = req.body ?? {}
  if (!statuses.includes(status)) return res.status(400).json({ error: `Choose a valid status: ${statuses.join(', ')}.` })
  item.status = status
  res.json(feedbackResponse(item))
})

export default router
