const express = require('express')
const { sendMessage, allMessage } = require('../controllers/MessageControllers')
const { protect } = require('../middleware/AuthMiddleware')
const router = express.Router()

router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, allMessage)

module.exports = router