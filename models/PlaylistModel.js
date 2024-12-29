const mongoose = require('mongoose')

const playlistSchema = mongoose.Schema({
    title: String,
    image: String,
    music: [{type: mongoose.Schema.Types.ObjectId, ref: 'music'}],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
})

const Playlist = mongoose.model('playlist', playlistSchema)

module.exports = Playlist