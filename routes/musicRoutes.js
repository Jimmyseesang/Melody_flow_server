const express = require('express')
const router = express.Router()

// import controller
const { findAllMusic, findById } = require('../controller/musicControl')

router.get('/findAllMusic', findAllMusic)
router.get('/findOne/:id', findById)

module.exports = router