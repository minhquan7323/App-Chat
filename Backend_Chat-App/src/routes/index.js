const UserRoutes = require('./UserRoutes')
const ChatRoutes = require('./ChatRoutes')

const routes = (app) => {
    app.use('/api/user', UserRoutes)
    app.use('/api/chat', ChatRoutes)
}
module.exports = routes