const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const generateToken = require('../config/GenerateToken')

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, avatar } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('The input is required')
    }
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const user = await User.create({
        name, email, password, avatar
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Failed to create the user')
    }
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid Email or Password")
    }
})

const allUsers = asyncHandler((async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {

    }
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
}))

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params // Lấy ID người dùng từ URL
    const { avatarUrl } = req.body // Lấy URL avatar từ request body

    if (!avatarUrl) {
        res.status(400)
        throw new Error('Avatar URL is required')
    }

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findById(id)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    // Cập nhật avatar mới
    user.avatar = avatarUrl
    const updatedUser = await user.save()  // Lưu người dùng mới với avatar đã cập nhật

    if (updatedUser) {
        console.log("Avatar updated:", updatedUser.avatar)  // Log avatar mới
        res.json({
            message: 'Avatar updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
            },
        })
    } else {
        res.status(400)
        throw new Error('Failed to update avatar')
    }
})

module.exports = {
    createUser,
    authUser,
    allUsers,
    updateUser
}