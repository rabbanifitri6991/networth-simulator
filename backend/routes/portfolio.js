const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/portfolioController')
const { validatePortfolio } = require('../middleware/validate')

// GET    /api/portfolio  — load saved portfolio
// POST   /api/portfolio  — save portfolio (with validation)
// DELETE /api/portfolio  — reset to defaults

router.get('/',    controller.getPortfolio)
router.post('/',   validatePortfolio, controller.savePortfolio)
router.delete('/', controller.resetPortfolio)

module.exports = router
