const mongoose = require('mongoose')

const musicSchema = mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    audioUrl: String,
    coverUrl: String,
    like: Number,
})

const Music = mongoose.model('music', musicSchema)

module.exports = Music