const Music = require('../models/musicModel')
const User = require('../models/userModel')

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

        const music = await Music.findOne({ _id: id })

        res.status(200).json({
            message: 'success',
            music
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error'
        })
    }

}

const getGenre = async (req, res) => {

    try {

        const  rawGenre = await Music.distinct('genre')
        let genre = rawGenre.map((e) => e.split(',')).flat().map((e) => e.trim())

        genre = Array.from(new Set(genre))

        res.status(200).json({
            genre
        })

    }
    catch (err) {
        res.status(500).json({
            message: 'err'
        })
    }

}

const getArtist = async (req, res) => {

    try {

        const artistCounts = await Music.aggregate([
            {
                $group: {
                    _id: "$artist",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            artistCounts
        });

    }
    catch (err) {
        res.status(500).json({
            message: 'err',
            error: err
        })
    }

}

const likeMusic = async (req, res) => {

    const {musicId} = req.body

    try {

        const user = await User.findOne({_id: req.id})
        if(user.like.includes(musicId)) {
            return res.status(400).json({message: 'You already liked this music'})
        }

        const music = await Music.findOneAndUpdate(
            { _id: musicId },
            { $inc: {like: 1}},
            { new: true }
        )
        
        if(!music) {
            return res.status(404).json({message: 'Music not found'})
        }

        user.like.push(musicId)
        await user.save()

        res.status(200).json({
            message: 'Liked music',
            music: {id: musicId, likeCount: music.like}
        })
        
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error'
        })
    }

}

const unlikeMusic = async (req, res) => {

    const {musicId} = req.body

    try {

        const user = await User.findOne({_id: req.id})
        if(!user.like.includes(musicId)) {
            return res.status(400).json({message: 'Music not found'})
        }

        const music = await Music.findOneAndUpdate(
            {_id: musicId},
            {$inc: {like: -1}},
            {new: true}
        )

        user.like = user.like.filter(id => id.toString() !== musicId);
        await user.save();
        
        res.status(200).json({
            message: 'ok',
            music,
            user
        })
        
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error'
        })
    }

}

module.exports = { findAllMusic, findById, getGenre, getArtist, likeMusic, unlikeMusic }