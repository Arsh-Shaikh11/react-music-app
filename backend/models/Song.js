const mongoose = require("mongoose");

// Artist Schema
const ArtistSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    photoPath: String, // Path to artist's photo (optional)
    createdAt: { type: Date, default: Date.now },
});

// Song Schema
const SongSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
    audioPath: { type: String, required: true },
    coverPath: String, // Path to song's cover photo (optional)
    createdAt: { type: Date, default: Date.now },
});

const Artist = mongoose.model("Artist", ArtistSchema);
const Song = mongoose.model("Song", SongSchema);

module.exports = { Artist, Song };