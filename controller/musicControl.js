const Music = require('../models/musicModel')

const findAllMusic = async (req, res) => {

    try {

        const music = await Music.find()

        res.status(200).json({
            message: 'success',
            music
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'server error'
        })
    }

}

const findById = async (req, res) => {

    const { id } = req.params

    try {

        const music = await Music.findOne({_id: id})

        res.status(200).json({
            message: 'success',
            music
        })

    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error'
        })
    }

}

module.exports = {findAllMusic, findById}