const mongoose = require('mongoose')

const artistSchema = mongoose.Schema({
    name: String,
    image: String,
    albums: [{type: mongoose.Schema.Types.ObjectId, ref: 'album'}],
    musics: [{type: mongoose.Schema.Types.ObjectId, ref: 'music'}]
})

const Artist = mongoose.model('artist', artistSchema)

module.exports = Artist