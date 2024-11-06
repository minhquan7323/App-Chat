const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const chats = require('./data/data')
const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.get('/', (req, res) => {
    res.send('API is running successfully')
})

app.get('/api/chat', (req, res) => {
    res.send(chats)
})
app.get('/api/chat/:id', (req, res) => {
    console.log('req', req.params.id)
    const singleChat = chats.find((chat) => chat._id === req.params.id)
    res.send(singleChat)
})

const PORT = process.env.PORT || 5000

app.listen(
    5000,
    console.log(`Server started on port ${PORT}`)
)