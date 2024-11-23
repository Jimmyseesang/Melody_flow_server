const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const User = require('../models/userModel')
require('dotenv').config()

const fs = require('fs')
const path = require('path')

const register = async (req, res) => {

    try {
        let { email, name, password } = req.body

        email = email.toLowerCase()

        const existEmail = await User.findOne({ email })
        if (existEmail) return res.status(409).json({ message: 'Email already exists' })

        password = await bcryptjs.hash(password, 10)
        const newUser = new User({
            email,
            name,
            password,
            role: 'user'
        })

        newUser.save()

        res.status(200).json({
            message: 'Register success',
        })
    }
    catch (err) {

        res.status(500).json({
            message: 'Sever error'
        })
        console.log(err)

    }
}

const login = async (req, res) => {

    try {

        let { email, password } = req.body
        email = email.toLowerCase()

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'Email or password incurrect' })

        const isPasswordCurrect = await bcryptjs.compare(password, user.password)
        if (!isPasswordCurrect) return res.status(404).json({ message: 'Email or password incurrect' })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_JWT_KEY, { expiresIn: '24h' })

        return res.status(200).json({
            message: 'Login success',
            token
        })

    }
    catch (err) {
        res.status(500).json({
            message: 'Server error'
        })
        console.log(err)
    }

}

const getProfile = async (req, res) => {

    const authHeader = req.header('Authorization')
    if (!authHeader) return res.status(401).json({ message: 'token not found' })

    const token = authHeader.split(' ')[1]

    try {

        const verifyToken = jwt.verify(token, process.env.SECRET_JWT_KEY)
        const id = verifyToken.id

        const user = await User.findOne({ _id: id })

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        res.status(200).json({
            user
        })

    }
    catch (err) {
        console.log('error verifing token!!!')
        res.status(500).json({
            message: 'access denied'
        })
    }

}

const uploadProfile = async (req, res) => {

    const id = req.id
    
    if (!req.files || !req.files.image || req.files.image.length === 0) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const file = req.files
        
    try {
        const user = await User.findOne({ _id: id })

        if (!user) return res.status(404).json({ message: 'user not found' })
        if (user.profile) {
            const oldFile = path.join(__dirname, '../public/userProfiles', user.profile)

            fs.unlink(oldFile, (err) => {
                if (err) {
                    console.log('Error deleting old profile', err)
                }
            })
        }

        user.profile = file.image[0].filename

        user.save()

        res.status(201).json({
            message: 'Add profile success'
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }

}

module.exports = { register, login, getProfile, uploadProfile }