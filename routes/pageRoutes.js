const express = require('express')
// controller
const {authPage} = require('../controller/authControl')

// middleware
const {checkIsAdmin} = require('../middleware/authUser')

const router = express.Router()

router.get('/page', checkIsAdmin, authPage)

module.exports = router