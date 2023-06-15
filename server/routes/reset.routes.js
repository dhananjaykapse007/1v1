const express = require('express')
const router = express.Router()

const resetController = require('../controllers/resetController')

router.get('/', resetController.reset)


module.exports = router;