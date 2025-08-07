const Song = require('../models/Song'); 

// Upload Song Controller
exports.uploadSong = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Received file:', req.file);

        const { name, artist } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        const newSong = new Song({
            title: name,
            artist,
            mp3File: `/uploads/${req.file.filename}`,
        });

        await newSong.save();
        res.status(201).json({ message: 'Song uploaded successfully', song: newSong });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Get All Songs Controller
exports.getSongs = async (req, res) => {
    try {
        const songs = await Song.find();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching songs', details: error.message });
    }
};
