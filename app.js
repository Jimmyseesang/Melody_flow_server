// import modules
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const path = require('path')

// import route
const adminRoute = require('./routes/adminRoutes')
const userRoute = require('./routes/userRoutes')
const authRoute = require('./routes/pageRoutes')
const musicRoute = require('./routes/musicRoutes')
const playlistRoute = require('./routes/playlistRoutes')

const app = express()

app.use(express.json())
app.use(cors()) 

app.use('/user', userRoute)
app.use('/admin',adminRoute)
app.use('/auth', authRoute)
app.use('/music', musicRoute)
app.use('/playlist', playlistRoute)
app.use('/musicImg', express.static(path.join(__dirname, '/public/images')))
app.use('/musicFile', express.static(path.join(__dirname, '/public/music')))
app.use('/profileImg', express.static(path.join(__dirname, '/public/userProfiles')))
app.use('/playlistImg', express.static(path.join(__dirname, '/public/playlistImage')))
app.use('/artistImage', express.static(path.join(__dirname, '/public/artistImage')))

connectDB()

module.exports = app