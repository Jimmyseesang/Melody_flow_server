const express = require('express')

// middlewaer
const { checkIsLogin } = require('../middleware/authUser')
const { playlistFile } = require('../middleware/multer')

// controller
const { addPlaylist, getPlaylist, addToPlaylist, deleteFromPlaylist, deletePlaylist, changePlaylistImage } = require('../controller/playlistControl')

const router = express.Router()

router.post('/addPlaylist', checkIsLogin, playlistFile.fields([{name: 'image'}]), addPlaylist)
router.post('/addToPlaylist', checkIsLogin, addToPlaylist)
router.get('/getPlaylist/:id', checkIsLogin, getPlaylist)
router.delete('/deleteFromPlaylist/:playlistID/:musicID', checkIsLogin, deleteFromPlaylist)
router.delete('/deletePlaylist/:id', checkIsLogin, deletePlaylist)
router.post('/changePlaylistImage/:playlistID', checkIsLogin, playlistFile.fields([{name: 'image'}]) ,changePlaylistImage)

module.exports = router