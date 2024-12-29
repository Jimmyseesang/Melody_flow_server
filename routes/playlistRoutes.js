const express = require('express')

// middlewaer
const { checkIsLogin } = require('../middleware/authUser')
const { playlistFile } = require('../middleware/multer')

// controller
const { addPlaylist, getPlaylist, addToPlaylist, deleteFromPlaylist, deletePlaylist } = require('../controller/playlistControl')

const router = express.Router()

router.post('/addPlaylist', checkIsLogin, playlistFile.fields([{name: 'image'}]), addPlaylist)
router.post('/addToPlaylist', checkIsLogin, addToPlaylist)
router.get('/getPlaylist/:id', checkIsLogin, getPlaylist)
router.delete('/deleteFromPlaylist', checkIsLogin, deleteFromPlaylist)
router.delete('/deletePlaylist/:id', checkIsLogin, deletePlaylist)

module.exports = router