const jwt = require('jsonwebtoken')

require('dotenv').config()

const authPage = async (req, res) => {

    res.status(200).json({
        message: 'Welcome to home page',
        isAdmin: req.isAdmin
    })


}

module.exports = {authPage}