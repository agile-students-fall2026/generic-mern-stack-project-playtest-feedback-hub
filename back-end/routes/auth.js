import { Router } from 'express'
import { randomBytes, randomUUID, scrypt as deriveKey } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(deriveKey)
const users = new Map()
const publicUser = ({ id, email }) => ({ id, email })

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

export default router
