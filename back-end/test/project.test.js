import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'
import { randomUUID } from 'node:crypto'

let owner
let other

async function signIn() {
  const credentials = { email: `project-${randomUUID()}@example.com`, password: 'test-password' }
  const agent = request.agent(app)
  await agent.post('/api/auth/register').send(credentials).expect(201)
  await agent.post('/api/auth/login').send(credentials).expect(200)
  return agent
}

before(async () => {
  owner = await signIn()
  other = await signIn()
})

describe('GET /api/projects', () => {
  it('requires an account', async () => {
    await request(app).get('/api/projects').expect(401)
  })

  it('lists only the projects created by the signed-in account', async () => {
    const project = await owner.post('/api/projects')
      .send({ name: 'Owned Game', developer: 'Test Developer', ownerId: 'another-account' }).expect(201)
    const ownList = await owner.get('/api/projects').expect(200)
    const otherList = await other.get('/api/projects').expect(200)
    expect(ownList.body.map(({ id }) => id)).to.include(project.body.id)
    expect(otherList.body).to.deep.equal([])
    expect(project.body).to.not.have.property('ownerId')
  })
})

describe('GET /api/projects/public', () => {
  it('finds public projects without revealing link-only projects or account IDs', async () => {
    const game = { name: 'Discovery Test', developer: 'Test Developer' }
    const publicProject = await owner.post('/api/projects').send(game).expect(201)
    const privateProject = await owner.post('/api/projects').send({ ...game, visibility: 'private' }).expect(201)
    const results = await request(app).get('/api/projects/public')
      .query({ search: 'DISCOVERY TEST', sort: 'alphabetical' }).expect(200)
    expect(results.body.map(({ id }) => id)).to.deep.equal([publicProject.body.id])
    expect(results.body[0]).to.not.have.property('ownerId')
    const linkedProject = await request(app).get(`/api/projects/${privateProject.body.id}`).expect(200)
    expect(linkedProject.body).to.not.have.property('ownerId')
  })
})

describe('POST /api/projects', () => {
  it('requires an account', async () => {
    await request(app).post('/api/projects').send({ name: 'Game', developer: 'Developer' }).expect(401)
  })
  it('creates a project', async () => {
    const res = await owner.post('/api/projects').send({
      name: 'Test Game',
      developer: 'Leo Chen',
    })
    expect(res.status).to.equal(201)
    expect(res.body.name).to.equal('Test Game')
    expect(res.body.developer).to.equal('Leo Chen')
    expect(res.body.visibility).to.equal('public')
  })
  it('rejects a missing game name', async () => {
    const res = await owner.post('/api/projects').send({
      developer: 'Leo Chen',
    })
    expect(res.status).to.equal(400)
  })
  it('rejects a missing developer name', async () => {
    const res = await owner.post('/api/projects').send({
      name: 'Test Game',
    })
    expect(res.status).to.equal(400)
  })
})
