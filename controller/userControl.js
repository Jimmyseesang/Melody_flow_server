const express = require('express')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const User = require('../models/userModel')
require('dotenv').config()

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
            rold: 'user'
        })

        newUser.save()

        res.status(200).json({
            message: 'Register success',
        })
    }
    catch(err) {

        res.status(500).json({
            message: 'Sever error'
        })
        console.log(err)

    }
}

const login = async (req, res) => {

    try {
        
        let {email, password} = req.body
        email = email.toLowerCase()
        
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({message: 'Email or password incurrect'})
        
        const isPasswordCurrect = await bcryptjs.compare(password, user.password)
        if(!isPasswordCurrect) return res.status(404).json({message: 'Email or password incurrect'})

        const token = jwt.sign({id: user._id, rold: user.rold}, process.env.SECRET_JWT_KEY, {expiresIn: '24h'})

        return res.status(200).json({
            message: 'Login success',
            token
        })
        
    }
    catch(err) {
        res.status(500).json({
            message: 'Server error'
        })
        console.log(err)
    }

}

module.exports = { register, login }