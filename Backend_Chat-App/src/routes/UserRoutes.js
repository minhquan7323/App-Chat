const express = require('express')
const { createUser, authUser, allUsers, updateUser } = require('../controllers/UserControllers')
const { protect } = require('../middleware/AuthMiddleware')
const router = express.Router()

router.route('/').post(createUser).get(protect, allUsers)
router.route('/signin').post(authUser)
router.put('/update/:id', updateUser)

module.exports = router