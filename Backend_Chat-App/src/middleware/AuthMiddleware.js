const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')

const protect = asyncHandler(async (req, res, next) => {
    console.log('Request Headers:', req.headers)

    let token
    if (
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) ||
        (req.headers.token && req.headers.token.startsWith('Bearer'))
    ) {
        try {
            token = req.headers.authorization
                ? req.headers.authorization.split(' ')[1]
                : req.headers.token.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    } else {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})



module.exports = { protect }