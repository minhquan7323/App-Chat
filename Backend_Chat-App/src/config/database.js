const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGO_DB}`)
        .then(() => {

            // console.log('Connected to MongoDB')
        })
        .catch((err) => {
            // console.error('Database connection error:', err)
            process.exit()
        })
}

module.exports = connectDB