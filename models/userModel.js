const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: String,
    name: String,
    password: String,
    profile: String,
    date: String,
    role: String,
    like: [{type: mongoose.Schema.Types.ObjectId, ref: 'music'}],
    playlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'playlist'}]
})

const User = mongoose.model('user', userSchema)

module.exports = User