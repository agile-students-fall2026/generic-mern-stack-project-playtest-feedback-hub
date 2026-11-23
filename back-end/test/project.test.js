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