const fs   = require('fs')
const path = require('path')

const DATA_FILE = path.join(__dirname, '../data/portfolio.json')

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
}

const DEFAULT_PORTFOLIO = {
  assets: {
    bank:   14000,
    epf:    14000,
    stocks: 10000,
    japan:  39712,   // ¥1,600,000 @ 0.02482
    asb:    0,
    btc:    750,
    sol:    500,
  },
  settings: {
    scenario:      'base',
    years:         10,
    monthlyEtf:    1500,
    monthlyBtc:    500,
    deployJapan:   true,
    includeCrypto: true,
  },
  savedAt: null
}

/**
 * GET /api/portfolio
 * Returns saved portfolio or defaults.
 */
exports.getPortfolio = (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.json(DEFAULT_PORTFOLIO)
    }
    const raw  = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = JSON.parse(raw)
    res.json(data)
  } catch (err) {
    console.error('getPortfolio error:', err)
    res.status(500).json({ error: 'Failed to load portfolio' })
  }
}

/**
 * POST /api/portfolio
 * Validates and saves portfolio data.
 */
exports.savePortfolio = (req, res) => {
  try {
    const { assets, settings } = req.body

    // Basic validation
    if (!assets || typeof assets !== 'object') {
      return res.status(400).json({ error: 'Invalid assets payload' })
    }

    const requiredAssets = ['bank', 'epf', 'stocks', 'japan', 'btc', 'sol']
    for (const key of requiredAssets) {
      if (typeof assets[key] !== 'number' || assets[key] < 0) {
        return res.status(400).json({ error: `Invalid asset value: ${key}` })
      }
    }

    const payload = {
      assets,
      settings: settings || DEFAULT_PORTFOLIO.settings,
      savedAt: new Date().toISOString()
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2))
    console.log(`Portfolio saved at ${payload.savedAt}`)
    res.json({ success: true, savedAt: payload.savedAt })
  } catch (err) {
    console.error('savePortfolio error:', err)
    res.status(500).json({ error: 'Failed to save portfolio' })
  }
}

/**
 * DELETE /api/portfolio
 * Resets portfolio to defaults.
 */
exports.resetPortfolio = (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE)
    res.json({ success: true, message: 'Portfolio reset to defaults' })
  } catch (err) {
    console.error('resetPortfolio error:', err)
    res.status(500).json({ error: 'Failed to reset portfolio' })
  }
}
