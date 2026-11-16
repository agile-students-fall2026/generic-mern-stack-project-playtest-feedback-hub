import express from 'express'
import authRouter from './routes/auth.js'
import feedbackRouter from './routes/feedback.js'

const app = express()

app.use(express.json())
app.use('/api/auth', authRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', feedbackRouter)

export default app
