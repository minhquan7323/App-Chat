const express = require('express')
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/ChatControllers')
const { protect } = require('../middleware/AuthMiddleware')
const router = express.Router()

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/addgroup').put(protect, addToGroup)
router.route('/removegroup').put(protect, removeFromGroup)

module.exports = router