const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/database')
const routes = require('./routes')
const { notFound, ErrorHandler } = require('./middleware/ErrorMiddleware')

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
app.use(ErrorHandler)

app.listen(port, () => {
    console.log('Server is running on port', port)
})