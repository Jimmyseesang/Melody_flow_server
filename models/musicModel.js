const mongoose = require('mongoose')

const musicSchema = mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    audioUrl: String,
    coverUrl: String,
    like: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
})

const Music = mongoose.model('music', musicSchema)

module.exports = Music