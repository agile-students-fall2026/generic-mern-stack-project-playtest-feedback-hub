import { readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'
import { uploadsDir } from '../routes/feedback.js'

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)

function listUploads() {
  return readdir(uploadsDir).catch(() => [])
}

function sendFeedback(projectId = '1') {
  return request(app)
    .post(`/api/projects/${projectId}/feedback`)
    .field('category', 'art')
    .field('feedback', 'The water texture flickers.')
}

describe('Feedback image uploads', () => {
  let existing = []

  before(async () => {
    existing = await listUploads()
  })

  after(async () => {
    const created = (await listUploads()).filter((name) => !existing.includes(name))
    await Promise.all(created.map((name) => rm(path.join(uploadsDir, name), { force: true })))
  })

  it('saves an uploaded image and serves it from /uploads', async () => {
    const res = await sendFeedback().attach('images', png, { filename: 'shot.png', contentType: 'image/png' })
    expect(res.status).to.equal(201)
    expect(res.body.images).to.have.length(1)
    expect(res.body.images[0]).to.match(/^\/uploads\/[\w-]+\.png$/)

    const image = await request(app).get(res.body.images[0])
    expect(image.status).to.equal(200)
    expect(image.headers['content-type']).to.equal('image/png')
    expect(image.headers['x-content-type-options']).to.equal('nosniff')
    expect(Buffer.compare(image.body, png)).to.equal(0)
  })

  it('keeps uploaded images and image links together', async () => {
    const res = await sendFeedback()
      .field('anonymous', 'true')
      .field('imageUrls', JSON.stringify(['https://example.com/a.png']))
      .attach('images', png, { filename: 'a.png', contentType: 'image/png' })
    expect(res.status).to.equal(201)
    expect(res.body.author).to.equal('Anonymous')
    expect(res.body.images[0]).to.match(/^\/uploads\//)
    expect(res.body.images[1]).to.equal('https://example.com/a.png')
  })

  it('accepts form feedback with no images', async () => {
    const res = await sendFeedback()
    expect(res.status).to.equal(201)
    expect(res.body.images).to.deep.equal([])
    expect(res.body.author).to.equal('Playtester')
  })

  it('rejects files that are not images', async () => {
    const res = await sendFeedback().attach('images', Buffer.from('hello'), { filename: 'notes.txt', contentType: 'text/plain' })
    expect(res.status).to.equal(400)
    expect(res.body.error).to.include('PNG')
  })

  it('rejects SVG images', async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
    const res = await sendFeedback().attach('images', svg, { filename: 'a.svg', contentType: 'image/svg+xml' })
    expect(res.status).to.equal(400)
  })

  it('rejects more than 5 images', async () => {
    let req = sendFeedback()
    for (let i = 0; i < 6; i++) req = req.attach('images', png, { filename: `${i}.png`, contentType: 'image/png' })
    const res = await req
    expect(res.status).to.equal(400)
    expect(res.body.error).to.include('up to 5')
  })

  it('rejects images over 5 MB', async () => {
    const big = Buffer.alloc(5 * 1024 * 1024 + 1)
    const res = await sendFeedback().attach('images', big, { filename: 'big.png', contentType: 'image/png' })
    expect(res.status).to.equal(400)
    expect(res.body.error).to.include('5 MB')
  })

  it('rejects files sent under another field name', async () => {
    const res = await sendFeedback().attach('photo', png, { filename: 'a.png', contentType: 'image/png' })
    expect(res.status).to.equal(400)
  })

  it('does not save images when the feedback is invalid', async () => {
    const before = await listUploads()
    const res = await request(app)
      .post('/api/projects/1/feedback')
      .field('category', 'art')
      .field('feedback', '   ')
      .attach('images', png, { filename: 'a.png', contentType: 'image/png' })
    expect(res.status).to.equal(400)
    expect(await listUploads()).to.deep.equal(before)
  })

  it('returns 404 for an unknown project', async () => {
    const res = await sendFeedback('999').attach('images', png, { filename: 'a.png', contentType: 'image/png' })
    expect(res.status).to.equal(404)
  })

  it('rejects a link list that is not valid JSON', async () => {
    const res = await sendFeedback().field('imageUrls', 'not json')
    expect(res.status).to.equal(400)
  })

  it('returns 404 for an image that does not exist', async () => {
    const res = await request(app).get('/uploads/missing.png')
    expect(res.status).to.equal(404)
  })
})
