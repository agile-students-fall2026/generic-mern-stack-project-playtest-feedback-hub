import { expect } from 'chai'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import app from '../app.js'

const validFeedback = {
  category: 'bugs',
  feedback: '  The jump button sometimes does nothing.  ',
  anonymous: false,
  imageUrls: ['https://example.com/bug.png'],
}

describe('GET /api/projects/:projectId', () => {
  it('returns the project', async () => {
    const res = await request(app).get('/api/projects/1')
    expect(res.status).to.equal(200)
    expect(res.body.name).to.equal('Harbor Quest')
  })

  it('returns 404 for an unknown project', async () => {
    const res = await request(app).get('/api/projects/999')
    expect(res.status).to.equal(404)
  })
})

describe('POST /api/projects/:projectId/feedback', () => {
  it('adds feedback to the project', async () => {
    const res = await request(app).post('/api/projects/2/feedback').send(validFeedback)
    expect(res.status).to.equal(201)
    expect(res.body).to.include({
      projectId: '2',
      category: 'Bugs',
      author: 'Playtester',
      status: 'Incomplete',
      text: 'The jump button sometimes does nothing.',
    })
    expect(res.body.images).to.deep.equal(['https://example.com/bug.png'])
    expect(res.body.submitted).to.match(/^\d{2}\/\d{2}\/\d{4}$/)
  })

  it('hides the author when anonymous', async () => {
    const res = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, anonymous: true })
    expect(res.status).to.equal(201)
    expect(res.body.author).to.equal('Anonymous')
  })

  it('returns 404 for an unknown project', async () => {
    const res = await request(app).post('/api/projects/999/feedback').send(validFeedback)
    expect(res.status).to.equal(404)
  })

  it('rejects empty feedback text', async () => {
    const res = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, feedback: '   ' })
    expect(res.status).to.equal(400)
  })

  it('rejects an unknown category', async () => {
    const res = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, category: 'music' })
    expect(res.status).to.equal(400)
  })

  it('rejects image links that are not http or https', async () => {
    const res = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, imageUrls: ['javascript:alert(1)'] })
    expect(res.status).to.equal(400)
  })

  it('rejects a request with no body', async () => {
    const res = await request(app).post('/api/projects/1/feedback')
    expect(res.status).to.equal(400)
  })

  it('accepts feedback at the length limit', async () => {
    const res = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, feedback: 'a'.repeat(2000) })
    expect(res.status).to.equal(201)
  })

  it('rejects feedback over 2000 characters', async () => {
    const res = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, feedback: 'a'.repeat(2001) })
    expect(res.status).to.equal(400)
    expect(res.body.error).to.include('2000')
  })

  it('rejects more than 5 image links', async () => {
    const imageUrls = Array.from({ length: 6 }, (_, i) => `https://example.com/${i}.png`)
    const res = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, imageUrls })
    expect(res.status).to.equal(400)
    expect(res.body.error).to.include('5')
  })

  it('rejects image links that are too long or not text', async () => {
    const longUrl = `https://example.com/${'a'.repeat(2048)}`
    const tooLong = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, imageUrls: [longUrl] })
    expect(tooLong.status).to.equal(400)
    const notText = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, imageUrls: [42] })
    expect(notText.status).to.equal(400)
  })

  it('rejects image links that are not valid URLs', async () => {
    const res = await request(app).post('/api/projects/1/feedback').send({ ...validFeedback, imageUrls: ['not a url'] })
    expect(res.status).to.equal(400)
  })
})

describe('Route order', () => {
  it('lets the projects router answer /api/projects/public', async () => {
    await request(app).get('/api/projects/public').expect(200)
  })

  it('still finds a project by id after the projects router', async () => {
    const res = await request(app).get('/api/projects/2')
    expect(res.status).to.equal(200)
    expect(res.body.name).to.equal('Paper Planet')
  })
})

describe('Account feedback', () => {
  let owner
  let tester
  let projectId
  let feedbackId

  async function registerAndSignIn() {
    const credentials = { email: `feedback-${randomUUID()}@example.com`, password: 'test-password' }
    const agent = request.agent(app)
    await agent.post('/api/auth/register').send(credentials).expect(201)
    await agent.post('/api/auth/login').send(credentials).expect(200)
    return agent
  }

  before(async () => {
    owner = await registerAndSignIn()
    tester = await registerAndSignIn()
    const project = await owner.post('/api/projects').send({ name: 'Feedback Game', developer: 'Test Developer' }).expect(201)
    projectId = project.body.id
    const response = await tester.post(`/api/projects/${projectId}/feedback`)
      .send({ ...validFeedback, anonymous: true }).expect(201)
    feedbackId = response.body.id
    expect(response.body.author).to.equal('Anonymous')
  })

  it('returns only that project\'s feedback', async () => {
    const res = await owner.get(`/api/projects/${projectId}/feedback`).expect(200)
    expect(res.body.map((item) => item.id)).to.deep.equal([feedbackId])
  })

  it('shows received feedback only to the project owner and accepts guest QR submissions', async () => {
    const guest = await request(app).post(`/api/projects/${projectId}/feedback`).send(validFeedback).expect(201)
    const received = await owner.get('/api/feedback').expect(200)
    expect(received.body.map((item) => item.id)).to.deep.equal([guest.body.id, feedbackId])
    expect(received.body[1]).to.include({ author: 'Anonymous', gameName: 'Feedback Game' })
    const otherReceived = await tester.get('/api/feedback').expect(200)
    expect(otherReceived.body).to.deep.equal([])
  })

  it('rejects signed-out access to account feedback', async () => {
    await request(app).get('/api/feedback').expect(401)
    await request(app).get(`/api/projects/${projectId}/feedback`).expect(401)
    await request(app).get(`/api/feedback/${feedbackId}`).expect(401)
    await request(app).patch(`/api/feedback/${feedbackId}`).send({ status: 'Resolved' }).expect(401)
  })

  it('returns 404 for missing or other accounts’ projects and received feedback', async () => {
    await owner.get('/api/projects/999/feedback').expect(404)
    await owner.get('/api/feedback/nope').expect(404)
    await owner.patch('/api/feedback/nope').send({ status: 'Resolved' }).expect(404)
    await tester.get(`/api/projects/${projectId}/feedback`).expect(404)
    await tester.get(`/api/feedback/${feedbackId}`).expect(404)
    await tester.patch(`/api/feedback/${feedbackId}`).send({ status: 'Resolved' }).expect(404)
  })

  it('lets the project owner view and update the feedback', async () => {
    const detail = await owner.get(`/api/feedback/${feedbackId}`).expect(200)
    expect(detail.body).to.include({ id: feedbackId, author: 'Anonymous' })
    const update = await owner.patch(`/api/feedback/${feedbackId}`).send({ status: 'Resolved' }).expect(200)
    expect(update.body.status).to.equal('Resolved')
  })

  it('rejects an unknown status', async () => {
    await owner.patch(`/api/feedback/${feedbackId}`).send({ status: 'Done' }).expect(400)
  })
})
