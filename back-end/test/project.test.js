import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('GET /api/projects', () => {
  it('returns the project list', async () => {
    const res = await request(app).get('/api/projects')
    expect(res.status).to.equal(200)
    expect(res.body.map((project) => project.name)).to.include('Glass Garden')
  })
})
describe('POST /api/projects', () => {
  it('creates a project', async () => {
    const res = await request(app).post('/api/projects').send({
      name: 'Test Game',
      developer: 'Leo Chen',
    })
    expect(res.status).to.equal(201)
    expect(res.body.name).to.equal('Test Game')
    expect(res.body.developer).to.equal('Leo Chen')
    expect(res.body.visibility).to.equal('public')
  })
  it('rejects a missing game name', async () => {
    const res = await request(app).post('/api/projects').send({
      developer: 'Leo Chen',
    })
    expect(res.status).to.equal(400)
  })
  it('rejects a missing developer name', async () => {
    const res = await request(app).post('/api/projects').send({
      name: 'Test Game',
    })
    expect(res.status).to.equal(400)
  })
})