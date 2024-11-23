
const Music = require('../models/musicModel')

// AddMusic
const addMusic = (req, res) => {

    if (req.files) {

        const { title, artist, genre } = req.body

        const newMusic = new Music({
            title,
            artist,
            genre: genre.toLowerCase(),
            audioUrl: req.files.audio[0].filename,
            coverUrl: req.files.image[0].filename,
            like: 0,
            createAt: Date.now(),
            updateAt: Date.now(),
        })

        newMusic.save()

        return res.status(200).json({
            message: 'Save music success',
            newMusic
        })
    } else {
        return res.status(404).json({
            message: "can't found the file"
        })
    }
}

// DeleteMusic
const deleteMusic = async (req, res) => {

    if (req.isAdmin) {
        try {
            const params = req.params.id;

            if (!params) {
                return res.status(500).json({ message: 'params not found' });
            }

            const result = await Music.deleteOne({ _id: params });

            if (result.deletedCount > 0) {
                return res.status(200).json({
                    message: 'delete success',
                });
            } else {
                return res.status(404).json({
                    message: 'Music not found',
                    params: req.params.id,
                });
            }
        } catch (err) {
            return res.status(500).json({
                message: 'server error',
            });
        }
    } else {
        res.status(403).json({
            message: 'Access denied',
        });
    }


}

// EditMusic
const editMusic = async (req, res) => {
    if(req.isAdmin) {
        try{


            const id = req.params.id
            const {title, artist, genre} = req.body

            const music = await Music.findByIdAndUpdate(id, {
                title,
                artist,
                genre,
                updateAt: Date.now()
            })

            if(music){
                return res.status(200).json({
                    message: 'Update success',
                    music
                })
            }
            else {
                return res.status(404).json({
                    message: 'music not found'
                })
            }

        }catch(err){
            res.status(500).json({
                message: 'server error',
            })
            console.log(err)   
        }
    }else{
        res.status(403).json({
            message: 'Access denied'
        })
    }
}



module.exports = { addMusic, deleteMusic, editMusic }