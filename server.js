require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const aiProcessor = require('./services/aiProcessor');
const youtubeProcessor = require('./services/youtubeProcessor');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
app.post('/api/upload', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Process the audio file
        const result = await aiProcessor.processAudio(req.file.path);
        
        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        res.json(result);
    } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).json({ error: 'Error processing upload' });
    }
});

app.post('/api/youtube', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }

        // Process the YouTube video
        const result = await youtubeProcessor.processVideo(url);
        res.json(result);
    } catch (error) {
        console.error('Error processing YouTube video:', error);
        res.status(500).json({ error: 'Error processing YouTube video' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 