import express from 'express'
import authRouter, { identifyUser } from './routes/auth.js'
import feedbackRouter, { uploadsDir } from './routes/feedback.js'
import projectsRouter from './routes/projects.js'

const app = express()

app.use(express.json())
app.use(identifyUser)
app.use('/api/auth', authRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => res.set('X-Content-Type-Options', 'nosniff'),
}))

app.use('/api', projectsRouter)
app.use('/api', feedbackRouter)

export default app
