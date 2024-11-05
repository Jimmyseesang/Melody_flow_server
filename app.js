const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

const adminRoute = require('./routes/adminRoutes')
const userRoute = require('./routes/userRoutes')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/user', userRoute)
app.use('/admin',adminRoute)

connectDB()

module.exports = app