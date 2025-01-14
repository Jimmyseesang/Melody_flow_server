const Music = require('../models/musicModel')
const fs = require('fs')
const path = require('path')
const Album = require('../models/albumModel')
const Artist = require('../models/artistModel')
const { default: mongoose } = require('mongoose')
const User = require('../models/userModel')
const Playlist = require('../models/PlaylistModel')

// AddMusic
const addMusic = async (req, res) => {

    const {title, artist, genre} = req.body

    try {

        const isArtist = await Artist.findOne({name: artist})

        const imagePath = path.join(__dirname, '../public/images', req.files.image[0].filename)
        const audioPath = path.join(__dirname, '../public/music', req.files.audio[0].filename)

        if(!isArtist) {

            fs.unlink(imagePath, err => {
                if(err) {
                    console.log('Unlink Error',err)
                }
            })
            fs.unlink(audioPath, err => {
                if(err) {
                    console.log('Unlink Error',err)
                }
            })
            
            return res.status(404).json({
                message: 'Artist not found'
            })
        }

        const newMusic = new Music({
            title,
            artist,
            genre: genre.toLowerCase(),
            audioUrl: req.files.audio[0].filename,
            coverUrl: req.files.image[0].filename,
            like: [],
            createAt: Date.now(),
            updateAt: Date.now()
        })

        await newMusic.save()
        await isArtist.musics.push(newMusic._id)
        await isArtist.save()

        res.status(200).json({
            message: 'Add music success'
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }

}

// DeleteMusic
const deleteMusic = async (req, res) => {

    const {musicId} = req.params

    if(!mongoose.Types.ObjectId.isValid(musicId)) {
        return res.status(400).json({
            message: 'Invalid ID format'
        })
    }

    try {

        const music = await Music.findOne({_id: musicId})

        if(!music) {
            return res.status(404).json({
                message: 'Music not found'
            })
        }
        
        const artistName = music.artist

        const artist = await Artist.findOne({name: artistName})

        const filePath = path.join(__dirname, '../public/music', music.audioUrl)
        const coverPath = path.join(__dirname, '../public/images', music.coverUrl)

        fs.unlink(filePath, (err) => {
            if(err) {
                console.log(err)
            }
        })

        fs.unlink(coverPath, err => {
            if(err) {
                console.log(err)
            }
        })

        // 1.Delete music
        await music.deleteOne()
        
        // 2.Delete music from artist
        const artistMusics = artist.musics
        artist.musics = artistMusics.filter(e => e.toString() !== musicId.toString())
        await artist.save()

        // 3.Delete music from user liked
        await User.updateMany(
            {like: musicId},
            {$pull: {like: musicId}}
        )
        // 4.Delete music from artist album
        await Album.updateMany(
            {musics: musicId},
            {$pull: {musics: musicId}}
        )
        // 5.Delete music from user playlist
        await Playlist.updateMany(
            {musics: musicId},
            {$pull: {musics: musicId}}
        )
        
        res.status(200).json({
            message: 'Delete music successfully'
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error'
        })
    }

}

const addArtist = async (req, res) => {
    try {

        let { name } = req.body
        const { image } = req.files

        if (!name || !image) {
            return res.status(400).json({
                message: "field name or image is empty"
            })
        }

        name = name.toLowerCase()

        const artistAleardyExit = await Artist.findOne({ name })

        const artistImage = path.join(__dirname, '../public/artistImage', image[0].filename)

        if (artistAleardyExit) {

            fs.unlink(artistImage, err => {
                if(err) {
                    console.log(err)
                }
            })

            return res.status(409).json({
                message: 'This artist already exists'
            })
        }

        const newArtist = new Artist({
            name,
            image: image[0].filename
        })

        await newArtist.save()



        res.status(201).json({
            message: 'Add artist success',
            newArtist
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

const deleteArtist = async (req, res) => {

    const {artistId} = req.params

    try {

        if(!mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({
                message: 'Invalid ID format'
            })
        }

        const artist = await Artist.findById(artistId)
        if(!artist) {
            return res.status(404).json({
                message: 'Artist not found'
            })
        }

        const artistImagePath = path.join(__dirname, '../public/artistImage', artist.image)

        fs.unlink(artistImagePath, err => {
            if(err) {
                console.log(err)
            }
        })

        delete artist
        await artist.deleteOne()

        // delete musics
        const musics = await Music.find({artist: artist.name})
        musics.map(e => {
            const musicImagePath = path.join(__dirname, '../public/images', e.coverUrl)
            const musicAudioPath = path.join(__dirname, '../public/music', e.audioUrl)

            fs.unlink(musicImagePath, err => {
                if(err) {
                    console.log(err)
                }
            })

            fs.unlink(musicAudioPath, err => {
                if(err) {
                    console.log(err)
                }
            })

        })
        const musicIds = musics.map(music => music._id)
        await Music.deleteMany({artist: artist.name})    

        // delete from user like
        await User.updateMany(
            {like: {$in: musicIds}},
            {$pull: {like: {$in: musicIds}}}
        )

        // delete from user playlist
        await Playlist.updateMany(
            {musics: {$in: musicIds}},
            {$pull: {musics: {$in: musicIds}}}
        )


        res.status(200).json({
            message: 'Delete artist success'
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error'
        })
    }

}

const getArtistAll = async (req, res) => {
    try {

        const artists = await Artist.find()

        res.status(200).json({
            artists
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

const getArtistById = async (req, res) => {
    try {

        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid ID format',
            });
        }

        const artist = await Artist.findById(id).populate('musics')

        res.status(200).json({
            artist
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

const changeArtistImage = async (req, res) => {

    const {artistId} = req.params
    const image = req.files.image[0].filename

    try {
        
        if(!artistId || !image) {
            res.status(400).json({
                message: "ID or image is empty"
            })
        }

        const artist = await Artist.findById(artistId)

        const imagePath = path.join(__dirname, '../public/artistImage', artist.image)
        fs.unlink(imagePath, err => {
            if(err) {
                console.log(err)
            }
        })

        artist.image = image
        await artist.save()

        res.status(200).json({
            message: 'Update image success'
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

const editMusic = async (req, res) => {

    const {musicId} = req.params

    const {title} = req.body
    const image = req.files.image[0].filename

    try {

        if(!mongoose.Types.ObjectId.isValid(musicId)) {
            return res.status(400).json({
                message: 'Invalid ID format'
            })
        }

        const music = await Music.findById(musicId)
        music.title = title
        music.image = image

        res.status(200).json({
            music,
            message: 'good'
        })
    }
    catch(err) { 
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

module.exports = { addMusic, deleteMusic, addArtist, deleteArtist, getArtistAll, getArtistById, changeArtistImage, editMusic }