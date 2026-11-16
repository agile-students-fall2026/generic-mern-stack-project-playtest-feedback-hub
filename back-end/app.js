import express from 'express'
import feedbackRouter from './routes/feedback.js'
import projectsRouter from './routes/projects.js'

const app = express()

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', feedbackRouter)
app.use('/api', projectsRouter)

export default app
