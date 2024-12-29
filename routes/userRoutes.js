const express = require('express')
const { register, login, getProfile, uploadProfile, searchMusic, searchGenre, artistMusic } = require('../controller/userControl')

// middleware
const { checkIsLogin } = require('../middleware/authUser')
const { userProfile, playlistFile } = require('../middleware/multer')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getProfile', getProfile)
router.post('/uploadProfile', checkIsLogin, userProfile.fields([{name: 'image'}]), uploadProfile)
router.post('/search', checkIsLogin, searchMusic)
router.post('/searchGenre', checkIsLogin, searchGenre)
router.get('/artistMusic/:name', checkIsLogin, artistMusic)

module.exports = router