const express = require('express')
const { register, login, getProfile, uploadProfile } = require('../controller/userControl')

// middleware
const { checkIsLogin } = require('../middleware/authUser')
const { userProfile } = require('../middleware/multer')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getProfile', getProfile)
router.post('/uploadProfile', checkIsLogin, userProfile.fields([{name: 'image'}]), uploadProfile)

module.exports = router