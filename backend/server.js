const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const portfolioRoutes = require('./routes/portfolio')

const app  = express()
const PORT = process.env.PORT || 3000

// ── Middleware ─────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Request logger (simple)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ── Routes ─────────────────────────────────────────────────────────────
app.use('/api/portfolio', portfolioRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Start ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ NetWorth API running on http://localhost:${PORT}`)
})
