/**
 * validate.js — Request validation middleware
 * Keeps controllers clean by handling validation here.
 */

/**
 * Validates POST /api/portfolio body.
 */
exports.validatePortfolio = (req, res, next) => {
  const { assets, settings } = req.body

  // Assets must exist and be an object
  if (!assets || typeof assets !== 'object' || Array.isArray(assets)) {
    return res.status(400).json({ error: 'assets must be an object' })
  }

  // All asset values must be non-negative numbers
  const requiredAssets = ['bank', 'epf', 'stocks', 'japan', 'asb', 'btc', 'sol']
  for (const key of requiredAssets) {
    if (assets[key] === undefined) {
      return res.status(400).json({ error: `Missing asset: ${key}` })
    }
    if (typeof assets[key] !== 'number' || isNaN(assets[key]) || assets[key] < 0) {
      return res.status(400).json({ error: `Invalid value for asset: ${key}` })
    }
  }

  // Settings validation (optional but if provided, validate)
  if (settings) {
    const validScenarios = ['bull', 'base', 'bear']
    if (settings.scenario && !validScenarios.includes(settings.scenario)) {
      return res.status(400).json({ error: `Invalid scenario. Must be one of: ${validScenarios.join(', ')}` })
    }
    if (settings.years && (settings.years < 1 || settings.years > 50)) {
      return res.status(400).json({ error: 'years must be between 1 and 50' })
    }
    if (settings.monthlyEtf && settings.monthlyEtf < 0) {
      return res.status(400).json({ error: 'monthlyEtf cannot be negative' })
    }
    if (settings.monthlyBtc && settings.monthlyBtc < 0) {
      return res.status(400).json({ error: 'monthlyBtc cannot be negative' })
    }
  }

  next()
}
