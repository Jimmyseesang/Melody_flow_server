const express = require('express')
const router = express.Router()

//controller
const { addMusic, deleteMusic, addAlbum, addArtist, deleteArtist, getArtistAll, getArtistById, deleteAlbum } = require('../controller/adminControl')

// Middleware
const { checkIsAdmin } = require('../middleware/authUser')
const { uploadFile, albumImage, artistImage } = require('../middleware/multer')

router.post('/addMusic', checkIsAdmin, uploadFile.fields([{ name: "image" }, { name: "audio" }]), addMusic)
router.delete('/deleteMusic/:id', checkIsAdmin, deleteMusic);
// Album
router.post('/addAlbum',checkIsAdmin,albumImage.fields([{name: "image"}]),addAlbum)
router.delete('/deleteAlbum/:id', checkIsAdmin, deleteAlbum)

router.post('/addArtist', checkIsAdmin, artistImage.fields([{ name: "image" }]), addArtist)
router.delete('/deleteArtist/:id', checkIsAdmin, deleteArtist)
router.get('/getArtistAll', checkIsAdmin, getArtistAll)
router.get('/getArtistId/:id', checkIsAdmin, getArtistById)

module.exports = router