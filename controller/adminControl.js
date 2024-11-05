const express = require('express')
const Music = require('../models/musicModel')

const addMusic = (req, res) => {

    const {title, artist, genre, audioUrl, coverUrl} = req.body

    res.status(200).json({message: 'Good'})

}

module.exports = {addMusic}