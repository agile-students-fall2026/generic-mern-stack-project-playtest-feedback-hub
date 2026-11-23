import { expect } from 'chai'
import request from 'supertest'
import { randomUUID } from 'node:crypto'
import app from '../app.js'

async function registerAccount() {
    const credentials = {
        email: `${randomUUID()}@example.com`,
        password: 'demo-password-123'
    }

    const response = await request(app)
        .post('/api/auth/register')
        .send(credentials)
        .expect(201)

    return { credentials, user: response.body.user }
}

describe('Change password', () => {
    it('changes the password for the signed-in account', async () => {
        const { credentials, user } = await registerAccount()
        const browser = request.agent(app)

        await browser.post('/api/auth/login')
            .send(credentials)
            .expect(200)

        const response = await browser.post('/api/auth/change-password')
            .send({ password: 'new-password-456' })
            .expect(200)

        expect(response.body).to.deep.equal({
            message: 'Password updated successfully.'
        })

        const current = await browser.get('/api/auth/me').expect(200)
        expect(current.body.user).to.deep.equal(user)

        await request(app).post('/api/auth/login')
            .send(credentials)
            .expect(401)

        await request(app).post('/api/auth/login')
            .send({
                email: credentials.email,
                password: 'new-password-456'
            })
            .expect(200)
    })

    it('rejects password changes from users who are not signed in', async () => {
        await request(app).post('/api/auth/change-password')
            .send({ password: 'new-password-456' })
            .expect(401)
    })

    it('rejects passwords shorter than 8 characters', async () => {
        const { credentials } = await registerAccount()
        const browser = request.agent(app)

        await browser.post('/api/auth/login')
            .send(credentials)
            .expect(200)

        const response = await browser.post('/api/auth/change-password')
            .send({ password: 'short' })
            .expect(400)

        expect(response.body.error).to.equal(
            'Password must be between 8 and 128 characters.'
        )
    })

    it('rejects passwords longer than 128 characters', async () => {
        const { credentials } = await registerAccount()
        const browser = request.agent(app)

        await browser.post('/api/auth/login')
            .send(credentials)
            .expect(200)

        await browser.post('/api/auth/change-password')
            .send({ password: 'a'.repeat(129) })
            .expect(400)
    })

    it('rejects a missing password', async () => {
        const { credentials } = await registerAccount()
        const browser = request.agent(app)

        await browser.post('/api/auth/login')
            .send(credentials)
            .expect(200)

        await browser.post('/api/auth/change-password')
            .send({})
            .expect(400)
    })
})
