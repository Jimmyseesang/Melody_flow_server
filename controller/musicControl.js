const { default: mongoose } = require('mongoose')
const Music = require('../models/musicModel')
const User = require('../models/userModel')
const Artist = require('../models/artistModel')

const findAllMusic = async (req, res) => {

    try {

        const music = await Music.find()

        res.status(200).json({
            message: 'success',
            music
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'server error'
        })
    }

}

const findById = async (req, res) => {

    const { id } = req.params

    try {

        const music = await Music.findOne({ _id: id })

        res.status(200).json({
            music
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error'
        })
    }

}

const getGenre = async (req, res) => {

    try {

        const  rawGenre = await Music.distinct('genre')
        let genre = rawGenre.map((e) => e.split(',')).flat().map((e) => e.trim())

        genre = Array.from(new Set(genre))

        res.status(200).json({
            genre
        })

    }
    catch (err) {
        res.status(500).json({
            message: 'err'
        })
    }

}

const getArtist = async (req, res) => {

    try {

        const artistCounts = await Music.aggregate([
            {
                $group: {
                    _id: "$artist",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            artistCounts
        });

    }
    catch (err) {
        res.status(500).json({
            message: 'err',
            error: err
        })
    }

}

const likeMusic = async (req, res) => {

    const {musicId} = req.body
    const id = req.id

    try {

        if(!mongoose.Types.ObjectId.isValid(musicId)) {
            return res.status(400).json({
                message: 'Invalid ID format'
            })
        }

        const user = await User.findById(id)
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const music = await Music.findById(musicId)
        if(!music) {
            return res.status(404).json({
                message: 'Music not found'
            })
        }

        if(user.like.some(e => e == musicId) || music.like.some(e => e == id)) {
            return res.status(400).json({
                message: 'This music is already liked'
            })
        }

        await music.like.push(id)
        await music.save()
        await user.like.push(musicId)
        await user.save()


        res.status(200).json({
            message: 'Like music success',
            musicName: music.title
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }

}

const unlikeMusic = async (req, res) => {

    const {musicId} = req.body
    const id = req.id

    try {

        if(!mongoose.Types.ObjectId.isValid(musicId)) {
            return res.status(400).json({
                message: 'Invalid ID format'
            })
        }

        const user = await User.findById(id)
        const music = await Music.findById(musicId)

        if(!user.like.some(e => e == musicId) || !music.like.some(e => e == id)) {
            return res.status(404).json({
                message: 'Not found music ID in user or user ID in music'
            })
        }

        const userLike = user.like.filter(e => e != musicId)
        const musicLike = music.like.filter(e => e != id)

        user.like = userLike
        music.like = musicLike

        await user.save()
        await music.save()

        res.status(200).json({
            message: 'dislike success',
            musicId: musicId,
            user: id
            
        })
        
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error'
        })
    }

}

const getRecomArtist = async (req, res) => {
    try {

        const artist = await Artist.find().limit(3)

        res.status(200).json({
            artist,
        })
    }catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

const artistById = async (req, res) => {

    const {artistId} = req.params

    try {



        if(!mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({
                message: 'Invalid ID format'
            })
        }

        const artist = await Artist.findById(artistId).populate('musics')
        const musics = artist.musics

        res.status(200).json({
            musics
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

module.exports = { findAllMusic, findById, getGenre, getArtist, likeMusic, unlikeMusic, getRecomArtist, artistById }