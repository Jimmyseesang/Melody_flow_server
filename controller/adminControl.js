const Music = require('../models/musicModel')
const fs = require('fs')
const path = require('path')
const Album = require('../models/albumModel')
const Artist = require('../models/artistModel')
const { default: mongoose } = require('mongoose')

// AddMusic
const addMusic = async (req, res) => {

    const {title, artist, genre} = req.body

    try {

        const isArtist = await Artist.findOne({name: artist})

        if(!isArtist) {
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
            like: 0,
            createAt: Date.now(),
            updateAt: Date.now()
        })

        await newMusic.save()
        await isArtist.musics.push(newMusic._id)
        await isArtist.save()

        res.status(200).json({
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

        await music.deleteOne()
        const artistMusics = artist.musics
        artist.musics = artistMusics.filter(e => e.toString() !== musicId.toString())
        await artist.save()
        
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

    // if (req.isAdmin) {
    //     try {
    //         const params = req.params.id;

    //         if (!params) {
    //             return res.status(500).json({ message: 'params not found' });
    //         }

    //         const result = await Music.findByIdAndDelete(params)
    //         const filePath = path.join(__dirname, '../public/music', result.audioUrl)
    //         const imagePath = path.join(__dirname, '../public/images', result.coverUrl)

    //         fs.unlink(filePath, (err) => {
    //             if (err) {
    //                 console.log('Delete file fail')
    //                 console.log(err)
    //             } else {
    //                 console.log('Delete file success')
    //             }
    //         })

    //         fs.unlink(imagePath, (err) => {
    //             if (err) {
    //                 console.log('Delete image fail')
    //                 console.log(err)
    //             } else {
    //                 console.log('Delete image success')
    //             }
    //         })

    //         console.log(result)
    //         console.log(imagePath)
    //         return res.status(200).json({
    //             message: 'delete success',
    //         });

    //     } catch (err) {
    //         return res.status(500).json({
    //             message: 'server error',
    //         });
    //     }
    // } else {
    //     res.status(403).json({
    //         message: 'Access denied',
    //     });
    // }


}

const addAlbum = async (req, res) => {

    const {title, artistId} = req.body
    const {image} = req.files

    try {

        if (!mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({
                message: 'Invalid ID format',
            });
        }

        if(!image) {
            return res.status(404).json({
                message: 'field image is empty'
            })
        }

        const imagePath = path.join(__dirname, '../public/albums', image[0].filename)

        const artist = await Artist.findOne({_id: artistId})
        if(!artist) {
            fs.unlink(imagePath, (err) => {
                if(err) {
                    console.log(err)
                }
            })
            return res.status(404).json({
                message: 'Artist not founed'
            })
        }

        const album = await Album.findOne({title})
        if(album) {
            fs.unlink(imagePath, (err) => {
                if(err) {
                    console.log(err)
                }
            })
            return res.status(409).json({
                message: 'This album name already exists'
            })
        }

        const newAlbum = new Album({
            title,
            artist: artistId,
            image: image[0].filename
        })

        await newAlbum.save()
        await artist.albums.push(newAlbum._id)
        await artist.save()
        
        res.status(200).json({
            message: 'Upload Album success',
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}


const deleteAlbum = async (req, res) => {

    const {id} = req.params
    
    try {

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid ID format'
            })
        }

        const album = await Album.findById(id)

        if(!album) {
            return res.status(404).json({
                message: 'Album not founded'
            })
        }

        const artistId = album.artist

        const artist = await Artist.findById(artistId)
        if(!artist) {
            return res.status(404).json({
                message: 'Artist not founded'
            })
        }
        
        const albumInArtist = artist.albums.filter(album => album.toString() !== id)

        await album.deleteOne()

        artist.albums = albumInArtist

        await artist.save()

        const coverPath = path.join(__dirname, '../public/albums', album.image)

        fs.unlink(coverPath, (err) => {
            if(err) {
                console.log(err)
            }
        })
        
        res.status(200).json({
            deleteAlbum: album,
            updateArtist: artist,
            message: 'delete album success'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

const addArtist = async (req, res) => {
    try {

        const { name } = req.body
        const { image } = req.files

        if (!name || !image) {
            return res.status(400).json({
                message: "field name or image is empty"
            })
        }

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

        await Music.deleteMany({_id: {$in: artist.musics}})
        await artist.deleteOne()
        
        res.status(200).json({
            message: 'Delete artist successfully'
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
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

        if (!id) {
            return res.status(400).json({
                message: 'ID is required',
            });
        }

        const artist = await Artist.findOne({ _id: id }).populate('albums')

        res.status(200).json({
            artist,
            message: 'good'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

module.exports = { addMusic, deleteMusic, addAlbum, deleteAlbum, addArtist, deleteArtist, getArtistAll, getArtistById }