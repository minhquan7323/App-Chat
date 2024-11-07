const express = require('express')
const { createUser, authUser } = require('../controllers/UserControllers')

const router = express.Router()

router.route('/signup').post(createUser)
router.route('/signin').post(authUser)
module.exports = router