const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const User = require('../models/userModel')
const Playlist = require('../models/PlaylistModel')
const Music = require('../models/musicModel')
const { title } = require('process')

const register = async (req, res) => {

    try {
        let { email, name, password } = req.body

        email = email.toLowerCase()

        const existEmail = await User.findOne({ email })
        if (existEmail) return res.status(409).json({ message: 'Email already exists' })

        password = await bcryptjs.hash(password, 10)
        const newUser = new User({
            email,
            name,
            password,
            role: 'user'
        })

        await newUser.save()

        res.status(200).json({
            message: 'Register success',
        })
    }
    catch (err) {

        res.status(500).json({
            message: 'Sever error'
        })
        console.log(err)

    }
}

const login = async (req, res) => {

    try {

        let { email, password } = req.body
        email = email.toLowerCase()

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'Email or password incurrect' })

        const isPasswordCurrect = await bcryptjs.compare(password, user.password)
        if (!isPasswordCurrect) return res.status(404).json({ message: 'Email or password incurrect' })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_JWT_KEY, { expiresIn: '24h' })

        return res.status(200).json({
            message: 'Login success',
            token
        })

    }
    catch (err) {
        res.status(500).json({
            message: 'Server error'
        })
        console.log(err)
    }

}

const getProfile = async (req, res) => {

    const authHeader = req.header('Authorization')
    if (!authHeader) return res.status(401).json({ message: 'token not found' })

    const token = authHeader.split(' ')[1]

    try {

        const verifyToken = jwt.verify(token, process.env.SECRET_JWT_KEY)
        const id = verifyToken.id

        const user = await User.findOne({ _id: id }).populate('playlist').populate('like')

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        res.status(200).json({
            user
        })

    }
    catch (err) {
        res.status(500).json({
            message: 'access denied'
        })
    }

}

const uploadProfile = async (req, res) => {

    const id = req.id

    if (!req.files || !req.files.image || req.files.image.length === 0) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const file = req.files

    try {
        const user = await User.findOne({ _id: id })

        if (!user) return res.status(404).json({ message: 'user not found' })
        if (user.profile) {
            const oldFile = path.join(__dirname, '../public/userProfiles', user.profile)

            fs.unlink(oldFile, (err) => {
                if (err) {
                    console.log('Error deleting old profile', err)
                }
            })
        }

        user.profile = file.image[0].filename

        await user.save()

        res.status(201).json({
            message: 'Add profile success'
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }

}

const searchMusic = async (req, res) => {

    const {word} = req.body

    try {

        const music = await Music.find({title: { $regex: word, $options: 'i' } })

        res.status(200).json({
            music
        })
    }
    catch(err) {
        res.status(500).json({
            message: 'server error'
        })
    }
}

const searchGenre = async (req, res) => {

    try {

        const {genre} = req.body

        const musics = await Music.find()
        
        const filterMusics = musics.filter(music => {
            const genres = music.genre.split(',').map(e => e.trim())
            return genres.includes(genre)
        })
        

        res.status(200).json({
            filterMusics
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'server error'
        })
    }

}

const artistMusic = async (req, res) => {
    try {

        const {name} = req.params

        const musics = await Music.find({artist: name})

        res.status(200).json({
            musics
        })
    }
    catch(err) {
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

module.exports = { register, login, getProfile, uploadProfile, searchMusic, searchGenre, artistMusic }