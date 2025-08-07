// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// require("dotenv").config();

// const app = express();
// app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:8081", // Allow requests from port 8081
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//   credentials: true // Allow cookies if needed
// }));
// // app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/music_app", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // ✅ Define Schemas
// const UserSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
//   role: { type: String, enum: ["user", "admin"], default: "user" },
// });

// const SongSchema = new mongoose.Schema({
//   name: String,
//   artist: String,
//   coverPath: String, 
//   audioPath: String, 
// });

// const User = mongoose.model("User", UserSchema);
// const Song = mongoose.model("Song", SongSchema);

// // ✅ Ensure "uploads" folder exists
// // const uploadDir = path.join(__dirname, "uploads");
// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, { recursive: true });
// // }

// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // ✅ Set up Multer storage
// // const storage = multer.diskStorage({
// //   destination: uploadDir,
// //   filename: (req, file, cb) => {
// //     cb(null, Date.now() + "-" + file.originalname);
// //   },
// // });
// // const upload = multer({ storage }); 



// // Set up storage
// // Storage configuration
// // Storage configuration
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //       cb(null, "./uploads"); // Ensure this folder exists
// //   },
// //   filename: (req, file, cb) => {
// //       cb(null, Date.now() + path.extname(file.originalname)); // Preserve file extension
// //   },
// // });


// // const storage = multer.diskStorage({
// //     destination: uploadDir, // Use absolute path
// //     filename: (req, file, cb) => {
// //         cb(null, Date.now() + "-" + file.originalname);
// //     },
// // });

// const storage = multer.diskStorage({
//   destination: uploadDir, // Use absolute path
//   filename: (req, file, cb) => {
//       cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // File filter to accept only MP3
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["audio/mpeg", "audio/mp3"];
//   if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//   } else {
//       cb(new Error("❌ Only MP3 files are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });
// // ✅ Serve static files (to access audio files)
// app.use("/uploads", express.static(uploadDir));



// // ✅ User Registration
// app.post("/register", async (req, res) => {
//   const { username, email, password, role } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, email, password: hashedPassword, role });
//     await newUser.save();
//     res.status(201).json({ message: "✅ User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "❌ Server error" });
//   }
// });

// // ✅ User Login
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ message: "❌ User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, "yourSecretKey", { expiresIn: "1h" });

//     res.json({ token, role: user.role });
//   } catch (error) {
//     res.status(500).json({ message: "❌ Server error" });
//   }
// });

// // ✅ Upload Song API
// // ✅ Upload Song API (No cover photo)
// // app.post("/add-song", upload.single("audio"), async (req, res) => {
// //   try {
// //     // Check if both 'name' and 'artist' are provided
// //     const { name, artist } = req.body;
// //     if (!name || !artist) {
// //       return res.status(400).json({ error: "❌ Name and artist are required" });
// //     }

// //     // Check if the audio file is provided
// //     if (!req.file) {
// //       return res.status(400).json({ error: "❌ Audio file is required" });
// //     }

// //     // Process the uploaded audio file
// //     const audioPath = req.file.path;

// //     const newSong = new Song({ name, artist, audioPath });
// //     await newSong.save();

// //     res.status(201).json({ message: "✅ Song uploaded successfully", song: newSong });
// //   } catch (error) {
// //     console.error("Upload error:", error);
// //     res.status(500).json({ error: "❌ Internal Server Error" });
// //   }
// // });

// // ✅ Upload Song API
// // app.post("/add-song", upload.single("audio"), async (req, res) => {
// //   try {
// //     const { name, artist } = req.body;
// //     if (!name || !artist) {
// //       return res.status(400).json({ error: "❌ Name and artist are required" });
// //     }

// //     if (!req.file) {
// //       return res.status(400).json({ error: "❌ Audio file is required" });
// //     }

// //     // Get the relative file path
// //     const audioPath = path.relative(__dirname, req.file.path);  // Get relative path

// //     const newSong = new Song({ name, artist, audioPath });
// //     await newSong.save();

// //     res.status(201).json({ message: "✅ Song uploaded successfully", song: newSong });
// //   } catch (error) {
// //     console.error("Upload error:", error);
// //     res.status(500).json({ error: "❌ Internal Server Error" });
// //   }
// // }); 

// // app.post("/add-song", upload.single("audio"), async (req, res) => {
// //   try {
// //     console.log("Received file:", req.file); // Debugging
// //     console.log("Request body:", req.body);

// //     const { name, artist } = req.body;
// //     if (!name || !artist) {
// //       return res.status(400).json({ error: "❌ Name and artist are required" });
// //     }

// //     if (!req.file) {
// //       return res.status(400).json({ error: "❌ Audio file is required" });
// //     }

// //     const audioPath = path.relative(__dirname, req.file.path);
// //     const newSong = new Song({ name, artist, audioPath });
// //     await newSong.save();

// //     res.status(201).json({ message: "✅ Song uploaded successfully", song: newSong });
// //   } catch (error) {
// //     console.error("Upload error:", error);
// //     res.status(500).json({ error: "❌ Internal Server Error" });
// //   }
// // }); main


// app.post("/add-song", upload.single("audio"), async (req, res) => {
//   try {
//       console.log("Request headers:", req.headers); // Log headers
//       console.log("Received file:", req.file);      // Log file details
//       console.log("Request body:", req.body);       // Log body details

//       const { name, artist } = req.body;
//       if (!name || !artist) {
//           return res.status(400).json({ error: "❌ Name and artist are required" });
//       }

//       if (!req.file) {
//           return res.status(400).json({ error: "❌ Audio file is required" });
//       }

//       const audioPath = path.relative(__dirname, req.file.path);
//       const newSong = new Song({ name, artist, audioPath });
//       await newSong.save();

//       res.status(201).json({ message: "✅ Song uploaded successfully", song: newSong });
//   } catch (error) {
//       console.error("Upload error:", error);
//       res.status(500).json({ error: "❌ Internal Server Error" });
//   }
// });


// // ✅ Get All Songs
// app.get("/songs", async (req, res) => {
//   try {
//     const songs = await Song.find();
//     res.json(songs);
//   } catch (error) {
//     res.status(500).json({ message: "❌ Server error" });
//   }
// });

// // ✅ Delete Song API
// app.delete("/delete-song/:id", async (req, res) => {
//   try {
//     const song = await Song.findById(req.params.id);
//     if (!song) return res.status(404).json({ message: "❌ Song not found" });

//     // Delete associated files
//     if (fs.existsSync(song.audioPath)) fs.unlinkSync(song.audioPath);
//     if (fs.existsSync(song.coverPath)) fs.unlinkSync(song.coverPath);

//     await song.deleteOne();
//     res.json({ message: "✅ Song deleted successfully" });

//   } catch (error) {
//     res.status(500).json({ message: "❌ Server error" });
//   }
// });

// // ✅ Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// require("dotenv").config();

// const { Artist, Song } = require("./models/Song");

// const app = express();
// app.use(express.json());
// app.use(cors({ origin: "http://localhost:8081", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
// app.use(express.urlencoded({ extended: true }));

// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/music_app", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // User Schema (unchanged)
// const UserSchema = new mongoose.Schema({
//     username: String,
//     email: String,
//     password: String,
//     role: { type: String, enum: ["user", "admin"], default: "user" },
// });
// const User = mongoose.model("User", UserSchema);

// // Setup Multer
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
// const storage = multer.diskStorage({
//     destination: uploadDir,
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });
// const fileFilter = (req, file, cb) => {
//     const allowedAudioTypes = ["audio/mpeg", "audio/mp3"];
//     const allowedImageTypes = ["image/jpeg", "image/png"];
//     if (allowedAudioTypes.includes(file.mimetype) || allowedImageTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("❌ Only MP3 audio and JPEG/PNG images are allowed!"), false);
//     }
// };
// const upload = multer({ storage, fileFilter });
// app.use("/uploads", express.static(uploadDir));

// // User Registration (unchanged)
// app.post("/register", async (req, res) => {
//     const { username, email, password, role } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: "User already exists" });
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, email, password: hashedPassword, role });
//         await newUser.save();
//         res.status(201).json({ message: "✅ User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "❌ Server error" });
//     }
// });

// // User Login (unchanged)
// app.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: "❌ User not found" });
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });
//         const token = jwt.sign({ id: user._id, role: user.role }, "yourSecretKey", { expiresIn: "1h" });
//         res.json({ token, role: user.role });
//     } catch (error) {
//         res.status(500).json({ message: "❌ Server error" });
//     }
// });

// // Add or Update Song (Updated for cover photo)
// app.post("/add-song", upload.fields([{ name: "audio" }, { name: "cover" }]), async (req, res) => {
//     try {
//         const { name, artistName } = req.body;
//         if (!name || !artistName) {
//             return res.status(400).json({ error: "❌ Song name and artist name are required" });
//         }
//         if (!req.files || !req.files.audio) {
//             return res.status(400).json({ error: "❌ Audio file is required" });
//         }

//         let artist = await Artist.findOne({ name: artistName });
//         if (!artist) {
//             artist = new Artist({ name: artistName });
//             await artist.save();
//         }

//         const audioPath = path.relative(__dirname, req.files.audio[0].path);
//         const coverPath = req.files.cover ? path.relative(__dirname, req.files.cover[0].path) : null;

//         const newSong = new Song({ name, artist: artist._id, audioPath, coverPath });
//         await newSong.save();

//         res.status(201).json({ message: "✅ Song uploaded successfully", song: newSong });
//     } catch (error) {
//         console.error("Upload error:", error);
//         res.status(500).json({ error: "❌ Internal Server Error" });
//     }
// });

// // Get All Artists
// app.get("/artists", async (req, res) => {
//     try {
//         const artists = await Artist.find();
//         res.json(artists);
//     } catch (error) {
//         res.status(500).json({ message: "❌ Server error" });
//     }
// });

// // Get Songs by Artist
// app.get("/songs/artist/:artistId", async (req, res) => {
//     try {
//         const songs = await Song.find({ artist: req.params.artistId }).populate("artist");
//         res.json(songs);
//     } catch (error) {
//         res.status(500).json({ message: "❌ Server error" });
//     }
// });

// // Get All Songs
// app.get("/songs", async (req, res) => {
//     try {
//         const songs = await Song.find().populate("artist");
//         res.json(songs);
//     } catch (error) {
//         res.status(500).json({ message: "❌ Server error" });
//     }
// });

// // Delete Song
// // app.delete("/delete-song/:id", async (req, res) => {
// //     try {
// //         const song = await Song.findById(req.params.id);
// //         if (!song) return res.status(404).json({ message: "❌ Song not found" });
// //         if (fs.existsSync(path.join(__dirname, song.audioPath))) {
// //             fs.unlinkSync(path.join(__dirname, song.audioPath));
// //         }
// //         if (song.coverPath && fs.existsSync(path.join(__dirname, song.coverPath))) {
// //             fs.unlinkSync(path.join(__dirname, song.coverPath));
// //         }
// //         await song.deleteOne();
// //         res.json({ message: "✅ Song deleted successfully" });
// //     } catch (error) {
// //         res.status(500).json({ message: "❌ Server error" });
// //     }
// // });

// app.delete("/delete-song/:id", async (req, res) => {
//     try {
//         const song = await Song.findById(req.params.id);
//         if (!song) return res.status(404).json({ message: "❌ Song not found" });
//         if (fs.existsSync(path.join(__dirname, song.audioPath))) {
//             fs.unlinkSync(path.join(__dirname, song.audioPath));
//         }
//         if (song.coverPath && fs.existsSync(path.join(__dirname, song.coverPath))) {
//             fs.unlinkSync(path.join(__dirname, song.coverPath));
//         }
//         await song.deleteOne();
//         res.json({ message: "✅ Song deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "❌ Server error" });
//     }
// });

// // Update Artist (New endpoint)
// // In server.js
// app.put("/update-artist/:id", upload.single("photo"), async (req, res) => {
//   try {
//       const { name } = req.body;
//       const artist = await Artist.findById(req.params.id);
//       if (!artist) return res.status(404).json({ message: "❌ Artist not found" });

//       artist.name = name || artist.name;
//       if (req.file) {
//           if (artist.photoPath && fs.existsSync(path.join(__dirname, artist.photoPath))) {
//               fs.unlinkSync(path.join(__dirname, artist.photoPath)); // Remove old photo
//           }
//           artist.photoPath = path.relative(__dirname, req.file.path);
//       }
//       await artist.save();
//       res.json({ message: "✅ Artist updated successfully", artist });
//   } catch (error) {
//       console.error("Update error:", error);
//       res.status(500).json({ error: "❌ Internal Server Error" });
//   }
// });

// // Get All Users
// app.get("/users", async (req, res) => {
//     try {
//       const users = await User.find();
//       res.json(users);
//     } catch (error) {
//       res.status(500).json({ message: "❌ Server error" });
//     }
//   });

// // Delete Artist (New endpoint)
// // app.delete("/delete-artist/:id", async (req, res) => {
// //     try {
// //         const artist = await Artist.findById(req.params.id);
// //         if (!artist) return res.status(404).json({ message: "❌ Artist not found" });

// //         const songs = await Song.find({ artist: artist._id });
// //         for (const song of songs) {
// //             if (fs.existsSync(path.join(__dirname, song.audioPath))) {
// //                 fs.unlinkSync(path.join(__dirname, song.audioPath));
// //             }
// //             if (song.coverPath && fs.existsSync(path.join(__dirname, song.coverPath))) {
// //                 fs.unlinkSync(path.join(__dirname, song.coverPath));
// //             }
// //             await song.deleteOne();
// //         }

// //         if (artist.photoPath && fs.existsSync(path.join(__dirname, artist.photoPath))) {
// //             fs.unlinkSync(path.join(__dirname, artist.photoPath));
// //         }
// //         await artist.deleteOne();
// //         res.json({ message: "✅ Artist and their songs deleted successfully" });
// //     } catch (error) {
// //         console.error("Delete error:", error);
// //         res.status(500).json({ error: "❌ Internal Server Error" });
// //     }
// // });

// app.delete("/delete-artist/:id", async (req, res) => {
//     try {
//         console.log(`Received DELETE request for artist ID: ${req.params.id}`);
//         const artist = await Artist.findById(req.params.id);
//         if (!artist) {
//             console.log("Artist not found for ID:", req.params.id);
//             return res.status(404).json({ message: "❌ Artist not found" });
//         }
//         console.log("Artist found:", artist.name);

//         const songs = await Song.find({ artist: artist._id });
//         console.log(`Deleting ${songs.length} songs for artist`);
//         for (const song of songs) {
//             const audioPath = path.join(__dirname, song.audioPath);
//             console.log(`Deleting song: ${song.name}, audioPath: ${audioPath}`);
//             if (fs.existsSync(audioPath)) {
//                 fs.unlinkSync(audioPath);
//                 console.log(`Deleted audio file: ${audioPath}`);
//             } else {
//                 console.log(`Audio file not found: ${audioPath}`);
//             }
//             if (song.coverPath) {
//                 const coverPath = path.join(__dirname, song.coverPath);
//                 if (fs.existsSync(coverPath)) {
//                     fs.unlinkSync(coverPath);
//                     console.log(`Deleted cover file: ${coverPath}`);
//                 } else {
//                     console.log(`Cover file not found: ${coverPath}`);
//                 }
//             }
//             await song.deleteOne();
//             console.log(`Deleted song document: ${song._id}`);
//         }

//         if (artist.photoPath) {
//             const photoPath = path.join(__dirname, artist.photoPath);
//             if (fs.existsSync(photoPath)) {
//                 fs.unlinkSync(photoPath);
//                 console.log(`Deleted artist photo: ${photoPath}`);
//             } else {
//                 console.log(`Artist photo not found: ${photoPath}`);
//             }
//         }
//         await artist.deleteOne();
//         console.log("Artist document deleted:", artist._id);
//         res.json({ message: "✅ Artist and their songs deleted successfully" });
//     } catch (error) {
//         console.error("Delete artist error:", error);
//         res.status(500).json({ error: "❌ Internal Server Error" });
//     }
// });
// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { Artist, Song } = require("./models/Song");

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:8081", "http://localhost:8080"], methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/music_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
});
const User = mongoose.model("User", UserSchema);

// Setup Multer
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedAudioTypes = ["audio/mpeg", "audio/mp3"];
    const allowedImageTypes = ["image/jpeg", "image/png"];
    if (allowedAudioTypes.includes(file.mimetype) || allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("❌ Only MP3 audio and JPEG/PNG images are allowed!"), false);
    }
};
const upload = multer({ storage, fileFilter });
app.use("/uploads", express.static(uploadDir));

// User Registration
app.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "✅ User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
});

// User Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "❌ User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });
        const token = jwt.sign({ id: user._id, role: user.role }, "yourSecretKey", { expiresIn: "1h" });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Add or Update Song
app.post("/add-song", upload.fields([{ name: "audio" }, { name: "cover" }]), async (req, res) => {
    try {
        const { name, artistName } = req.body;
        if (!name || !artistName) {
            return res.status(400).json({ error: "❌ Song name and artist name are required" });
        }
        if (!req.files || !req.files.audio) {
            return res.status(400).json({ error: "❌ Audio file is required" });
        }

        let artist = await Artist.findOne({ name: artistName });
        if (!artist) {
            artist = new Artist({ name: artistName });
            await artist.save();
        }

        const audioPath = path.relative(__dirname, req.files.audio[0].path).replace(/\\/g, '/');
        const coverPath = req.files.cover ? path.relative(__dirname, req.files.cover[0].path).replace(/\\/g, '/') : null;

        const newSong = new Song({ name, artist: artist._id, audioPath, coverPath });
        await newSong.save();

        res.status(201).json({ message: "✅ Song uploaded successfully", song: newSong });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

// Update Artist
app.put("/update-artist/:id", upload.single("photo"), async (req, res) => {
    try {
        const { name } = req.body;
        const artist = await Artist.findById(req.params.id);
        if (!artist) return res.status(404).json({ message: "❌ Artist not found" });

        artist.name = name || artist.name;
        if (req.file) {
            if (artist.photoPath && fs.existsSync(path.join(__dirname, artist.photoPath))) {
                fs.unlinkSync(path.join(__dirname, artist.photoPath));
            }
            artist.photoPath = path.relative(__dirname, req.file.path).replace(/\\/g, '/');
        }
        await artist.save();
        res.json({ message: "✅ Artist updated successfully", artist });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

// Get All Artists
app.get("/artists", async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Get Songs by Artist
app.get("/songs/artist/:artistId", async (req, res) => {
    try {
        const songs = await Song.find({ artist: req.params.artistId }).populate("artist");
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Get All Songs
app.get("/songs", async (req, res) => {
    try {
        const songs = await Song.find().populate("artist");
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Delete Song
app.delete("/delete-song/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: "❌ Song not found" });
        if (fs.existsSync(path.join(__dirname, song.audioPath))) {
            fs.unlinkSync(path.join(__dirname, song.audioPath));
        }
        if (song.coverPath && fs.existsSync(path.join(__dirname, song.coverPath))) {
            fs.unlinkSync(path.join(__dirname, song.coverPath));
        }
        await song.deleteOne();
        res.json({ message: "✅ Song deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Delete Artist
app.delete("/delete-artist/:id", async (req, res) => {
    try {
        console.log(`Received DELETE request for artist ID: ${req.params.id}`);
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            console.log("Artist not found for ID:", req.params.id);
            return res.status(404).json({ message: "❌ Artist not found" });
        }
        console.log("Artist found:", artist.name);

        const songs = await Song.find({ artist: artist._id });
        console.log(`Deleting ${songs.length} songs for artist`);
        for (const song of songs) {
            const audioPath = path.join(__dirname, song.audioPath);
            console.log(`Deleting song: ${song.name}, audioPath: ${audioPath}`);
            if (fs.existsSync(audioPath)) {
                fs.unlinkSync(audioPath);
                console.log(`Deleted audio file: ${audioPath}`);
            } else {
                console.log(`Audio file not found: ${audioPath}`);
            }
            if (song.coverPath) {
                const coverPath = path.join(__dirname, song.coverPath);
                if (fs.existsSync(coverPath)) {
                    fs.unlinkSync(coverPath);
                    console.log(`Deleted cover file: ${coverPath}`);
                } else {
                    console.log(`Cover file not found: ${coverPath}`);
                }
            }
            await song.deleteOne();
            console.log(`Deleted song document: ${song._id}`);
        }

        if (artist.photoPath) {
            const photoPath = path.join(__dirname, artist.photoPath);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
                console.log(`Deleted artist photo: ${photoPath}`);
            } else {
                console.log(`Artist photo not found: ${photoPath}`);
            }
        }
        await artist.deleteOne();
        console.log("Artist document deleted:", artist._id);
        res.json({ message: "✅ Artist and their songs deleted successfully" });
    } catch (error) {
        console.error("Delete artist error:", error);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

// Get All Users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));