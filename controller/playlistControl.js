const Playlist = require('../models/PlaylistModel')
const User = require('../models/userModel')
const Music = require('../models/musicModel')

const mongoose = require('mongoose')

const addPlaylist = async (req, res) => {

    const user = await User.findOne({ _id: req.id })
    const { title } = req.body
    const files = req.files
    const image = files.image[0].filename

    if (!user) return res.status(404).json({ message: 'user not found' })

    try {

        const newPlaylist = new Playlist({
            title,
            image,
            user: user._id
        })

        user.playlist.push(newPlaylist._id)
        await newPlaylist.save()
        await user.save()

        res.status(201).json({
            message: 'Playlist created successfully',
        })

    }
    catch (err) {

        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })

    }

}

const addToPlaylist = async (req, res) => {

    try {

        const { playlistId, musicId } = req.body
        if (!playlistId || !musicId) return res.status(404).json({ message: 'Failed adding music to playlist' })

        const playlist = await Playlist.findOne({ _id: playlistId })
        const music = await Music.findOne({ _id: musicId })

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' })
        }

        if (!music) {
            return res.status(404).json({ message: 'Music not found' })
        }

        if (playlist.musics.includes(music._id)) {
            return res.status(409).json({ message: 'Music already exists in the playlist' })
        }

        playlist.musics.push(music._id)

        await playlist.save()

        res.status(201).json({
            message: 'add music to playlist success',
            playlist
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'failed'
        })

    }

}

const getPlaylist = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: 'Playlist ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid playlist ID' });
    }

    try {
        const playlist = await Playlist.findOne({ _id: id }).populate('musics');

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json({
            message: 'Good',
            playlist,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed' });
    }
}

const deleteFromPlaylist = async (req, res) => {

    const id = req.id

    const { musicId } = req.params.id

    if (!musicId) return res.status(400).json({ message: 'music id not found' })

    try {

        const user = await User.findOne({ _id: id })

        res.status(200).json({
            message: 'Good',
            user,
            musicId
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'failed'
        })
    }

}

const deletePlaylist = async (req, res) => {

    const id = req.id
    const playlistId = req.params.id

    if (!playlistId) return res.status(400).json({ message: 'playlist id not founded' })

    try {

        const user = await User.findOne({ _id: id })
        const playlist = await Playlist.findOne({ _id: playlistId })

        if (!user) return res.status(404).json({ message: 'User not found' })
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' })

        const permission = user._id.toString() === playlist.user.toString() ? true : false
        if (!permission) return res.status(403).json({ message: 'access denide' })

        const upDatePlaylist = user.playlist.filter(playlist => playlist.toString() !== playlistId)()

        user.playlist = upDatePlaylist
        await user.save()
        await playlist.deleteOne()

        res.status(200).json({
            message: 'Delete success',
            playlistID: playlistId
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'failed'
        })
    }
}

module.exports = { addPlaylist, addToPlaylist, getPlaylist, deleteFromPlaylist, deletePlaylist }

