import { randomUUID } from 'node:crypto'
import express from 'express'
import projects from '../data/projects.js'
import feedback from '../data/feedback.js'

const router = express.Router()

const categories = ['Bugs', 'Gameplay', 'Art', 'Audio', 'Other']
const statuses = ['Complete', 'Incomplete', 'WIP', 'Resolved', 'Assigned']

function findProject(id) {
  return projects.find((project) => project.id === id)
}

function isWebUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

router.get('/projects/:projectId', (req, res) => {
  const project = findProject(req.params.projectId)
  if (!project) return res.status(404).json({ error: 'Project not found.' })
  res.json(project)
})

router.get('/projects/:projectId/feedback', (req, res) => {
  const { projectId } = req.params
  if (!findProject(projectId)) return res.status(404).json({ error: 'Project not found.' })
  res.json(feedback.filter((item) => item.projectId === projectId))
})

// A playtester sends feedback to a project.
router.post('/projects/:projectId/feedback', (req, res) => {
  const { projectId } = req.params
  if (!findProject(projectId)) return res.status(404).json({ error: 'Project not found.' })

  const { category, feedback: text, anonymous = false, imageUrls = [] } = req.body ?? {}
  // The form sends lowercase values like "bugs"; developer pages show "Bugs".
  const label = categories.find((name) => name.toLowerCase() === String(category).toLowerCase())
  if (!label) return res.status(400).json({ error: 'Choose a valid category.' })
  if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: 'Feedback text is required.' })
  if (!Array.isArray(imageUrls) || !imageUrls.every(isWebUrl)) {
    return res.status(400).json({ error: 'Image links must be http or https URLs.' })
  }

  const item = {
    id: randomUUID(),
    projectId,
    category: label,
    // Placeholder name until the account system gives us the signed-in user.
    author: anonymous === true ? 'Anonymous' : 'Playtester',
    submitted: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    status: 'Incomplete',
    text: text.trim(),
    images: imageUrls,
  }
  feedback.push(item)
  res.status(201).json(item)
})

// All feedback, newest first, with each project's name for the developer history page.
router.get('/feedback', (req, res) => {
  const newestFirst = [...feedback].sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
  res.json(newestFirst.map((item) => ({ ...item, gameName: findProject(item.projectId)?.name })))
})

router.get('/feedback/:feedbackId', (req, res) => {
  const item = feedback.find((entry) => entry.id === req.params.feedbackId)
  if (!item) return res.status(404).json({ error: 'Feedback not found.' })
  res.json(item)
})

router.patch('/feedback/:feedbackId', (req, res) => {
  const item = feedback.find((entry) => entry.id === req.params.feedbackId)
  if (!item) return res.status(404).json({ error: 'Feedback not found.' })
  const { status } = req.body ?? {}
  if (!statuses.includes(status)) return res.status(400).json({ error: 'Choose a valid status.' })
  item.status = status
  res.json(item)
})

export default router
