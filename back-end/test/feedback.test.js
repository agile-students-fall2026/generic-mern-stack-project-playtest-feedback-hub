import { expect } from 'chai'
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

    const list = await request(app).get('/api/projects/2/feedback')
    expect(list.body.map((item) => item.id)).to.include(res.body.id)
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
    const res = await request(app).get('/api/projects/public')
    expect(res.body.error).to.not.equal('Project not found.')
  })

  it('still finds a project by id after the projects router', async () => {
    const res = await request(app).get('/api/projects/2')
    expect(res.status).to.equal(200)
    expect(res.body.name).to.equal('Paper Planet')
  })
})

describe('GET /api/projects/:projectId/feedback', () => {
  it('returns only that project\'s feedback', async () => {
    const res = await request(app).get('/api/projects/3/feedback')
    expect(res.status).to.equal(200)
    expect(res.body).to.have.length.above(0)
    expect(res.body.every((item) => item.projectId === '3')).to.equal(true)
  })

  it('returns 404 for an unknown project', async () => {
    const res = await request(app).get('/api/projects/999/feedback')
    expect(res.status).to.equal(404)
  })
})

describe('GET /api/feedback', () => {
  it('returns all feedback newest first with game names', async () => {
    const res = await request(app).get('/api/feedback')
    expect(res.status).to.equal(200)
    const dates = res.body.map((item) => new Date(item.submitted).getTime())
    expect(dates).to.deep.equal([...dates].sort((a, b) => b - a))
    expect(res.body.find((item) => item.id === '7').gameName).to.equal('Paper Planet')
  })
})

describe('GET /api/feedback/:feedbackId', () => {
  it('returns one feedback item', async () => {
    const res = await request(app).get('/api/feedback/1')
    expect(res.status).to.equal(200)
    expect(res.body.author).to.equal('Sam Rivera')
  })

  it('returns 404 for unknown feedback', async () => {
    const res = await request(app).get('/api/feedback/nope')
    expect(res.status).to.equal(404)
  })
})

describe('PATCH /api/feedback/:feedbackId', () => {
  it('changes the status', async () => {
    const res = await request(app).patch('/api/feedback/2').send({ status: 'Resolved' })
    expect(res.status).to.equal(200)
    expect(res.body.status).to.equal('Resolved')
  })

  it('rejects an unknown status', async () => {
    const res = await request(app).patch('/api/feedback/2').send({ status: 'Done' })
    expect(res.status).to.equal(400)
  })

  it('returns 404 for unknown feedback', async () => {
    const res = await request(app).patch('/api/feedback/nope').send({ status: 'Resolved' })
    expect(res.status).to.equal(404)
  })
})
