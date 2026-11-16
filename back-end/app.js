import express from 'express'
import feedbackRouter from './routes/feedback.js'

const app = express()

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', feedbackRouter)

export default app
