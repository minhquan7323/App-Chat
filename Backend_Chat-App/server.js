const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const chats = require('./data/data')
const connectDB = require('./config/database')

dotenv.config()
connectDB()
const app = express()
const port = process.env.PORT || 5000

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

app.listen(port, () => {
    console.log('Server is running on port', port)
})