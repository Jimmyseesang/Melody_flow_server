const jwt = require('jsonwebtoken')

require('dotenv').config()

const checkIsAdmin = async (req, res, next) => {

    const authHeader = req.header('Authorization')
    if(!authHeader) return res.status(401).json({message: 'token not found'})

    const token = authHeader.split(' ')[1]

    try {

        const user = jwt.verify(token, process.env.SECRET_JWT_KEY)
        if(user.role === 'admin') {
            req.isAdmin = true
        }
        else {
            req.isAdmin = false
        }
        next()

    }
    catch (err) {

        console.log('error verifing token!!!')
        res.status(500).json({
            message: 'access denied'
        })  

    }

}

module.exports = {checkIsAdmin}