const UserRoutes = require('./UserRoutes')
const ChatRoutes = require('./ChatRoutes')
const MessageRoutes = require('./MessageRoutes')

const routes = (app) => {
    app.use('/api/user', UserRoutes)
    app.use('/api/chat', ChatRoutes)
    app.use('/api/message', MessageRoutes)
}
module.exports = routes