const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const chats = require('./data/Data')
const connectDB = require('./config/database')
const routes = require('./routes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
connectDB()
routes(app)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log('Server is running on port', port)
})