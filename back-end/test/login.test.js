import { expect } from 'chai'
import request from 'supertest'
import { randomUUID } from 'node:crypto'
import app from '../app.js'

async function registerAccount() {
  const credentials = { email: `${randomUUID()}@example.com`, password: 'demo-password-123' }
  const response = await request(app).post('/api/auth/register').send(credentials).expect(201)
  return { credentials, user: response.body.user }
}

describe('Account sign-in', () => {
  it('signs in with a normalized email and identifies the account from its session', async () => {
    const { credentials, user } = await registerAccount()
    const browser = request.agent(app)
    const response = await browser.post('/api/auth/login')
      .send({ ...credentials, email: ` ${credentials.email.toUpperCase()} ` }).expect(200)

    expect(response.body).to.deep.equal({ user })
    expect(response.headers['set-cookie'][0]).to.include('HttpOnly').and.include('SameSite=Strict')
    const current = await browser.get('/api/auth/me').expect(200)
    expect(current.body).to.deep.equal({ user })
    await request(app).get('/api/auth/me').expect(401)
  })

  it('rejects a wrong password and an unknown email with the same response', async () => {
    const { credentials } = await registerAccount()
    const wrong = await request(app).post('/api/auth/login')
      .send({ ...credentials, password: 'wrong-password' }).expect(401)
    const unknown = await request(app).post('/api/auth/login')
      .send({ ...credentials, email: `${randomUUID()}@example.com` }).expect(401)

    expect(wrong.body).to.deep.equal({ error: 'Incorrect email or password.' })
    expect(unknown.body).to.deep.equal(wrong.body)
    expect(wrong.headers).not.to.have.property('set-cookie')
    expect(unknown.headers).not.to.have.property('set-cookie')
  })

  it('validates the login body and requires JSON', async () => {
    await request(app).post('/api/auth/login').send({}).expect(400)
    await request(app).post('/api/auth/login').type('form').send({ email: 'test@example.com' }).expect(415)
  })

  it('replaces the previous session when the browser signs in again', async () => {
    const { credentials } = await registerAccount()
    const browser = request.agent(app)
    const first = await browser.post('/api/auth/login').send(credentials).expect(200)
    const second = await browser.post('/api/auth/login').send(credentials).expect(200)
    const firstCookie = first.headers['set-cookie'][0].split(';')[0]
    const secondCookie = second.headers['set-cookie'][0].split(';')[0]

    expect(secondCookie).not.to.equal(firstCookie)
    await request(app).get('/api/auth/me').set('Cookie', firstCookie).expect(401)
    await browser.get('/api/auth/me').expect(200)
  })

  it('expires sessions after 24 hours', async () => {
    const { credentials } = await registerAccount()
    const login = await request(app).post('/api/auth/login').send(credentials).expect(200)
    const cookie = login.headers['set-cookie'][0].split(';')[0]
    const now = Date.now

    try {
      Date.now = () => now() + 24 * 60 * 60 * 1000
      await request(app).get('/api/auth/me').set('Cookie', cookie).expect(401)
    } finally {
      Date.now = now
    }
  })
})
