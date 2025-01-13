const express = require('express')
const router = express.Router()

// import controller
const { findAllMusic, findById, getGenre, getArtist, likeMusic, unlikeMusic, getRecomArtist, artistById } = require('../controller/musicControl')
const { checkIsLogin } = require('../middleware/authUser')

router.get('/findAllMusic', findAllMusic)
router.get('/findOne/:id', findById)
router.get('/findGenre', getGenre)
router.get('/findArtist', getArtist)
router.get('/recomArtist', getRecomArtist)
router.get('/artistById/:artistId', artistById)
router.post('/likeMusic', checkIsLogin, likeMusic)
router.post('/unlikeMusic', checkIsLogin, unlikeMusic)

module.exports = router