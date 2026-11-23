
import { expect } from 'chai'
import request from 'supertest'
import { randomUUID } from 'node:crypto'
import app from '../app.js'

async function registerAccount() {
    const credentials = {
        email: `${randomUUID()}@example.com`,
        password: 'demo-password-123'
    }

    await request(app)
        .post('/api/auth/register')
        .send(credentials)
        .expect(201)

    return credentials
}

async function getResetToken(email) {
    const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email })
        .expect(200)

    const resetUrl = response.body.resetUrl

    expect(resetUrl).to.be.a('string')

    return new URL(resetUrl).searchParams.get('token')
}

describe('Forgot password', () => {

    it('sends a reset link for an existing account', async () => {
        const credentials = await registerAccount()

        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: credentials.email })
            .expect(200)

        expect(response.body.message).to.equal(
            'If an account exists with this email, password reset instructions will be sent.'
        )

        const token = await getResetToken(credentials.email)

        expect(token).to.be.a('string')
        expect(token).to.have.length(64)
    })

    it('returns the same response for an unknown email', async () => {
        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: `${randomUUID()}@example.com` })
            .expect(200)

        expect(response.body.message).to.equal(
            'If an account exists with this email, password reset instructions will be sent.'
        )
    })

    it('resets the password using a valid token', async () => {
        const credentials = await registerAccount()
        const token = await getResetToken(credentials.email)

        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({
                token,
                password: 'new-password-456'
            })
            .expect(200)

        expect(response.body.message).to.equal(
            'Password reset successfully.'
        )

        await request(app)
            .post('/api/auth/login')
            .send(credentials)
            .expect(401)

        await request(app)
            .post('/api/auth/login')
            .send({
                email: credentials.email,
                password: 'new-password-456'
            })
            .expect(200)
    })

    it('rejects an invalid reset token', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({
                token: 'invalid-token',
                password: 'new-password-456'
            })
            .expect(400)

        expect(response.body.error).to.equal(
            'This password reset link is invalid or expired.'
        )
    })

    it('rejects an expired reset token', async () => {
        const credentials = await registerAccount()
        const token = await getResetToken(credentials.email)

        const now = Date.now

        try {
            Date.now = () => now() + 16 * 60 * 1000

            await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token,
                    password: 'new-password-456'
                })
                .expect(400)
        } finally {
            Date.now = now
        }
    })

    it('rejects a reset token that has already been used', async () => {
        const credentials = await registerAccount()
        const token = await getResetToken(credentials.email)

        await request(app)
            .post('/api/auth/reset-password')
            .send({
                token,
                password: 'new-password-456'
            })
            .expect(200)

        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({
                token,
                password: 'another-password-789'
            })
            .expect(400)

        expect(response.body.error).to.equal(
            'This password reset link is invalid or expired.'
        )
    })

    it('rejects passwords shorter than 8 characters', async () => {
        const credentials = await registerAccount()
        const token = await getResetToken(credentials.email)

        await request(app)
            .post('/api/auth/reset-password')
            .send({
                token,
                password: 'short'
            })
            .expect(400)
    })

    it('rejects passwords longer than 128 characters', async () => {
        const credentials = await registerAccount()
        const token = await getResetToken(credentials.email)

        await request(app)
            .post('/api/auth/reset-password')
            .send({
                token,
                password: 'a'.repeat(129)
            })
            .expect(400)
    })

})
