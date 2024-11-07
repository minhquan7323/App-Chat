const UserRoutes = require('./UserRoutes')

const routes = (app) => {
    app.use('/api/user', UserRoutes)
}
module.exports = routes