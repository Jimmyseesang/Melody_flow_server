const jwt = require('jsonwebtoken')

require('dotenv').config()

const checkIsAdmin = async (req, res, next) => {

    const authHeader = req.header('Authorization')
    const token = authHeader.split(' ')[1]

    if(!token) res.status(401).json({message: 'token not found'})

    try {

        const user = jwt.verify(token, process.env.SECRET_JWT_KEY)
        if(user.role === 'admin') {
            console.log('Admin login ^-^')
            req.isAdmin = true
        }
        else {
            console.log('User login ^-^')
            req.isAdmin = false
        }
        next()

    }
    catch (err) {

        console.log('error verifing token!!!')

    }

}

module.exports = {checkIsAdmin}