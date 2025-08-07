const express = require('express');
const multer = require('multer');
const router = express.Router();
const songController = require('../controllers/songController');

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('audioFile'), songController.uploadSong);
router.get('/songs', songController.getSongs);

module.exports = router;
