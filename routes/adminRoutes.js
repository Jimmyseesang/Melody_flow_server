const express = require('express')
const router = express.Router()

//controller
const { addMusic, deleteMusic, addArtist, deleteArtist, getArtistAll, getArtistById, changeArtistImage, editMusic, } = require('../controller/adminControl')

// Middleware
const { checkIsAdmin } = require('../middleware/authUser')
const { uploadFile, albumImage, artistImage } = require('../middleware/multer')

// Music
router.post('/addMusic', checkIsAdmin, uploadFile.fields([{ name: "image" }, { name: "audio" }]), addMusic)
router.patch('/editMusic/:musicId', checkIsAdmin, editMusic)
router.delete('/deleteMusic/:musicId', checkIsAdmin, uploadFile.fields([{name: "image"}]), deleteMusic);

// Artist
router.post('/addArtist', checkIsAdmin, artistImage.fields([{ name: "image" }]), addArtist)
router.delete('/deleteArtist/:artistId', checkIsAdmin, deleteArtist)

router.get('/getArtistAll', checkIsAdmin, getArtistAll)
router.get('/getArtistId/:id', checkIsAdmin, getArtistById)
router.post('/changeArtistImage/:artistId', checkIsAdmin, artistImage.fields([{ name: "image" }]), changeArtistImage)

module.exports = router