const jwt = require('jsonwebtoken')

require('dotenv').config()

// Check admin permission
const authAdminPage = async (req, res) => res.status(200).json({isAdmin: req.isAdmin})

// Check user permission
const authUserPage = async (req, res) => res.status(200).json({isLogin: req.isLogin})

module.exports = {authAdminPage, authUserPage}