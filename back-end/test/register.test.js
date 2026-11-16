import { expect } from 'chai'
import request from 'supertest'
import { randomUUID } from 'node:crypto'
import app from '../app.js'

const account = () => ({ email: `${randomUUID()}@example.com`, password: 'demo-password-123' })

describe('POST /api/auth/register', () => {
  it('creates an account with normalized email and exposes only public fields', async () => {
    const input = account()
    const response = await request(app).post('/api/auth/register')
      .send({ ...input, email: ` ${input.email.toUpperCase()} ` }).expect(201)
    expect(response.body.user).to.have.all.keys('id', 'email')
    expect(response.body.user.id).to.be.a('string').and.not.equal('')
    expect(response.body.user.email).to.equal(input.email)
    expect(response.headers['set-cookie']).to.equal(undefined)
  })

  it('rejects duplicates regardless of email casing', async () => {
    const input = account()
    await request(app).post('/api/auth/register').send(input).expect(201)
    const duplicate = await request(app).post('/api/auth/register')
      .send({ ...input, email: input.email.toUpperCase() }).expect(409)
    expect(duplicate.body.error).to.equal('An account with this email already exists.')
  })

  it('allows only one of two concurrent registrations of the same email', async () => {
    const input = account()
    const responses = await Promise.all([
      request(app).post('/api/auth/register').send(input),
      request(app).post('/api/auth/register').send(input),
    ])
    expect(responses.map(response => response.status).sort()).to.deep.equal([201, 409])
  })

  it('rejects missing, malformed, and out-of-range credentials', async () => {
    const invalid = [
      {}, { ...account(), email: [] }, { ...account(), email: 'invalid' },
      { ...account(), email: `${'a'.repeat(250)}@example.com` },
      { ...account(), password: 12345678 }, { ...account(), password: 'short' },
      { ...account(), password: 'x'.repeat(129) },
    ]
    for (const input of invalid) {
      const response = await request(app).post('/api/auth/register').send(input).expect(400)
      expect(response.body.error).to.be.a('string')
    }
  })

  it('accepts passwords at both length boundaries', async () => {
    for (const length of [8, 128]) {
      await request(app).post('/api/auth/register')
        .send({ ...account(), password: 'x'.repeat(length) }).expect(201)
    }
  })

  it('rejects cross-site form submissions', async () => {
    await request(app).post('/api/auth/register').type('form').send(account()).expect(415)
  })
})
