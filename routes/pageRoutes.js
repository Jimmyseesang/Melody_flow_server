const express = require('express')
// controller
const {authAdminPage, authUserPage} = require('../controller/authControl')

// middleware
const {checkIsAdmin, checkIsLogin} = require('../middleware/authUser')

const router = express.Router()

router.get('/page', checkIsAdmin, authAdminPage)
router.get('/userPage', checkIsLogin, authUserPage)

module.exports = router