const Album = require("../models/albumModel");
const Artist = require("../models/artistModel");

const checkBeforeAdd = async (req, res, next) => {
    try {
        const { title, artist } = req.body;

        // ตรวจสอบว่าอัลบั้มซ้ำหรือไม่
        const album = await Album.findOne({ title });
        if (album) {
            return res.status(400).json({
                message: 'This album already exists',
            });
        }

        // ตรวจสอบว่า artist มีอยู่หรือไม่
        const isArtist = await Artist.findOne({ _id: artist });
        if (!isArtist) {
            return res.status(404).json({
                message: 'Artist not found',
            });
        }

        next(); // ไปที่ middleware ถัดไป
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Server error',
        });
    }
};

module.exports = { checkBeforeAdd }