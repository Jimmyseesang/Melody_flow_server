const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')) {
            cb(null, './public/images')
        }else if(file.mimetype.startsWith('audio/mpeg')) {
            cb(null, './public/music')
        }else {
            cb(new Error('Unknown file extension'))
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/userProfiles')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const playlistImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/playlistImage')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const albumsImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/albums')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const artistImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/artistImage')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const uploadFile = multer({storage})
const userProfile = multer({storage: profileStorage})
const playlistFile = multer({storage: playlistImageStorage})
const albumImage = multer({storage: albumsImageStorage})
const artistImage = multer({storage: artistImageStorage})

module.exports = {uploadFile, userProfile, playlistFile, albumImage, artistImage}