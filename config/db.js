const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = () => {
    mongoose.connect(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`)
        .then(() => {console.log('connect to mongodb success ^-^')})
        .catch(err => console.log('connect to mongodb fail !!!',err))
}

module.exports = connectDB