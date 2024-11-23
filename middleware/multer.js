const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')) {
            cb(null, './public/images')
        }else if(file.mimetype.startsWith('audio/mpeg')) {
            cb(null, './public/music')
        }else {
            cb(new Error('invalid file type'))
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

const uploadFile = multer({storage})
const userProfile = multer({storage: profileStorage})


module.exports = {uploadFile, userProfile}