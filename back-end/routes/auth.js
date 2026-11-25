import { Router } from 'express'
import { randomBytes, randomUUID, scrypt as deriveKey, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(deriveKey)
const users = new Map()
const sessions = new Map()
const sessionLifetime = 24 * 60 * 60 * 1000
const sessionCookie = 'pfh_session'
const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}
const publicUser = ({ id, email }) => ({ id, email })
const resetTokens = new Map()
const resetTokenLifetime = 15 * 60 * 1000 

function sessionToken(req) {
  const prefix = `${sessionCookie}=`
  return (req.headers.cookie || '').split(';').map(part => part.trim())
    .find(part => part.startsWith(prefix))?.slice(prefix.length)
}

export function identifyUser(req, res, next) {
  const token = sessionToken(req)
  const session = sessions.get(token)
  if (session && session.expiresAt > Date.now()) {
    req.user = session.user
  } else if (session) {
    sessions.delete(token)
  }
  next()
}

export function requireUser(req, res, next) {
  res.set('Cache-Control', 'no-store')
  if (!req.user) return res.status(401).json({ error: 'Please sign in to continue.' })
  next()
}

const router = Router()
// JSON-only mutations prevent cross-site HTML forms from changing auth state.
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(415).json({ error: 'Send requests as application/json.' })
  }
  next()
})

function credentials(req) {
  const { email, password } = req.body || {}
  if (typeof email !== 'string' || typeof password !== 'string') return null
  const normalized = email.trim().toLowerCase()
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !password || password.length > 128) return null
  return { email: normalized, password }
}

router.post('/register', async (req, res) => {
  const input = credentials(req)
  if (!input || input.password.length < 8) {
    return res.status(400).json({ error: 'Enter a valid email and a password of 8–128 characters.' })
  }
  if (users.has(input.email)) return res.status(409).json({ error: 'An account with this email already exists.' })
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(input.password, salt, 64)
  // Another registration may finish while the password is being hashed.
  if (users.has(input.email)) return res.status(409).json({ error: 'An account with this email already exists.' })
  const user = { id: randomUUID(), email: input.email, salt, hash }
  users.set(user.email, user)
  res.status(201).json({ user: publicUser(user) })
})

router.post('/login', async (req, res) => {
  const input = credentials(req)
  if (!input) return res.status(400).json({ error: 'Enter a valid email and password.' })
  const user = users.get(input.email)
  const hash = await scrypt(input.password, user?.salt ?? 'unregistered-account', 64)
  if (!user || !timingSafeEqual(hash, user.hash)) {
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }

  const now = Date.now()
  for (const [token, session] of sessions) {
    if (session.expiresAt <= now) sessions.delete(token)
  }
  sessions.delete(sessionToken(req))
  const token = randomBytes(32).toString('hex')
  const account = publicUser(user)
  sessions.set(token, { user: account, expiresAt: now + sessionLifetime })
  res.cookie(sessionCookie, token, { ...cookieOptions, maxAge: sessionLifetime })
  res.json({ user: account })
})

router.post('/change-password', requireUser, async (req, res) => {
    const { password } = req.body || {}
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
        return res.status(400).json({
            error: 'Password must be between 8 and 128 characters.'
        })
    }
    const user = users.get(req.user.email)
    if (!user) {
        return res.status(401).json({
            error: 'Please sign in to continue.'
        })
    }
    const salt = randomBytes(16).toString('hex')
    const hash = await scrypt(password, salt, 64)
    user.salt = salt
    user.hash = hash
    const currentToken = sessionToken(req)
    for (const [token, session] of sessions) {
        if (session.user.id === user.id && token !== currentToken) {
            sessions.delete(token)
        }
    }
    res.json({ message: 'Password updated successfully.' })
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body || {}
    if (typeof email !== 'string') {
        return res.status(400).json({ error: 'Enter a valid email address.' })
    }
    const normalizedEmail = email.trim().toLowerCase()
    const user = users.get(normalizedEmail)
    const message = 'If an account exists with this email, password reset instructions will be sent.'
    if (!user) {
        return res.json({ message })
    }
    for (const [hash, token] of resetTokens) {
        if (token.email === user.email) {
            resetTokens.delete(hash)
        }
    }
    const token = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(token).digest('hex')
    resetTokens.set(tokenHash, {
        email: user.email,
        expiresAt: Date.now() + resetTokenLifetime
    })
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`
    return res.json({message, resetUrl})
})

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body || {}
    if (
        typeof token !== 'string' || typeof password !== 'string' || password.length < 8 || password.length > 128) {
        return res.status(400).json({
            error: 'Invalid reset request or password.'
        })
    }
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const reset = resetTokens.get(tokenHash)
    if (!reset || reset.expiresAt <= Date.now()) {
        resetTokens.delete(tokenHash)
        return res.status(400).json({
            error: 'This password reset link is invalid or expired.'
        })
    }
    const user = users.get(reset.email)
    if (!user) {
        resetTokens.delete(tokenHash)
        return res.status(400).json({
            error: 'This password reset link is invalid or expired.'
        })
    }
    const salt = randomBytes(16).toString('hex')
    const hash = await scrypt(password, salt, 64)
    user.salt = salt
    user.hash = hash
    resetTokens.delete(tokenHash)
    for (const [sessionToken, session] of sessions) {
        if (session.user.id === user.id) {
            sessions.delete(sessionToken)
        }
    }
    return res.json({
        message: 'Password reset successfully.'
    })
})

router.get('/me', requireUser, (req, res) => res.json({ user: req.user }))

export default router
