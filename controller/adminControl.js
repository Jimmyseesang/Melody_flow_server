
const Music = require('../models/musicModel')

const addMusic = (req, res) => {
    if(req.files) {

        const {title, artist, genre} = req.body

        const newMusic = new Music({
            title,
            artist,
            genre,
            audioUrl: req.files.audio[0].filename,
            coverUrl: req.files.image[0].filename
        })

        newMusic.save()

        return res.status(200).json({
            message: 'Save music success',
            newMusic
        })
    }else {
        return res.status(404).json({
            message: "can't found the file"
        })
    }
}

module.exports = {addMusic}