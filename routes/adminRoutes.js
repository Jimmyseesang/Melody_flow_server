const express = require('express')
const router = express.Router()

//controller
const {addMusic} = require('../controller/adminControl')

// Middleware
const {checkIsAdmin} = require('../middleware/authUser')
const {uploadFile} = require('../middleware/multer')

router.post('/addMusic', checkIsAdmin, uploadFile.fields([{name: "image"}, {name: "audio"}]), addMusic)

module.exports = router