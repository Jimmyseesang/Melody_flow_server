const express = require('express')
const {addMusic} = require('../controller/adminControl')

const router = express.Router()

router.post('/addMusic',addMusic)

module.exports = router