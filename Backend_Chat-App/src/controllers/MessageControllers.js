const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const Chat = require('../models/ChatModel')
const Message = require('../models/MessageModel')

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body
    if (!content || !chatId) {
        res.status(400)
        throw new Error('Invalid data passed into request')
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try {
        let message = await Message.create(newMessage)
        message = await Message.findById(message._id)
            .populate('sender', 'name avatar')
            .populate('chat')
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name avatar email'
        })
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const allMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name avatar')
            .populate('chat')

        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = {
    sendMessage,
    allMessage
}