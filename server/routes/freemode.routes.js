const express = require('express')
const router = express.Router()

const freemodeController = require('../controllers/freemodeController')

router.post('/submit', freemodeController.submit_code)


module.exports = router;