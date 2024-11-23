const express = require('express')
const router = express.Router()

//controller
const {addMusic, deleteMusic, editMusic} = require('../controller/adminControl')

// Middleware
const {checkIsAdmin} = require('../middleware/authUser')
const {uploadFile} = require('../middleware/multer')
    
router.post('/addMusic', checkIsAdmin, uploadFile.fields([{name: "image"}, {name: "audio"}]), addMusic)
router.delete('/deleteMusic/:id', checkIsAdmin, deleteMusic);
router.patch('/editMusic/:id', checkIsAdmin, editMusic)

module.exports = router