const mongoose = require('mongoose')

const albumSchema = mongoose.Schema({
    title: String,
    image: String,
    artist: {type: mongoose.Schema.Types.ObjectId, ref: 'artist'}
})

const Album = mongoose.model('album', albumSchema)

module.exports = Album