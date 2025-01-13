const mongoose = require('mongoose')

const albumSchema = mongoose.Schema({
    title: String,
    image: String,
    musics: [{type: mongoose.Schema.Types.ObjectId, ref: 'musics'}],
    artist: {type: mongoose.Schema.Types.ObjectId, ref: 'artist'}
})

const Album = mongoose.model('album', albumSchema)

module.exports = Album