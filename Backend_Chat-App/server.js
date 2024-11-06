const express = require('express')
const chats = require('./data/data')
const app = express()

app.get('/', (req, res) => {
    res.send('API is running')
})

app.get('/api/chat', (req, res) => {
    res.send(chats)
})
app.get('/api/chat/:id', (req, res) => {
    console.log('req', req.params.id)
    const singleChat = chats.find((chat) => chat._id === req.params.id)
    res.send(singleChat)
})

app.listen(
    5000,
    console.log('Server started on port 5000')
)