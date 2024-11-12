const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/database')
const routes = require('./routes')
const { notFound, ErrorHandler } = require('./middleware/ErrorMiddleware')
dotenv.config()
const app = express()
const port = process.env.PORT || 5000
const path = require("path")

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
connectDB()
routes(app)
// --------------------------deployment------------------------------

// const __dirname1 = path.resolve()

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname1, "../Frontend_Chat-App/build")))

//     app.get("*", (req, res) =>
//         res.sendFile(path.resolve(__dirname1, "../Frontend_Chat-App/build", "index.html"))
//     )
// } else {
app.get("/", (req, res) => {
    res.send("API is running..")
})
// }

// --------------------------deployment------------------------------
app.use(notFound)
app.use(ErrorHandler)

const server = app.listen(port, () => {
    // console.log('Server is running on port', port)
})
const io = require('socket.io')(server, {
    pingTimeOut: 60000,
    cors: {
        origin: '*'
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io")
    socket.on("setup", (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined Room: " + room)
    })
    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat

        if (!chat.users) return console.log("chat.users not defined")

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return

            socket.in(user._id).emit("message recieved", newMessageReceived)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })
})