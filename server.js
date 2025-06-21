require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const aiProcessor = require('./services/aiProcessor');
const youtubeProcessor = require('./services/youtubeProcessor');
const { initDatabase } = require('./services/database');
const { authenticateToken, optionalAuth } = require('./services/auth');
const authRoutes = require('./services/authRoutes');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// Initialize database
let db;
initDatabase()
    .then(database => {
        db = database;
        console.log('Database initialized successfully');
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

// Middleware
app.use(cors());
app.use(express.json());

// Add database to request object
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'client/build')));

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

// Authentication routes
app.use('/api/auth', authRoutes);

// Protected API Routes (require authentication)
app.post('/api/upload', authenticateToken, upload.single('audio'), async (req, res) => {
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

app.post('/api/youtube', authenticateToken, async (req, res) => {
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

// Public health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'AI Meeting Summarizer API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API available at http://localhost:${port}/api`);
    console.log(`React app available at http://localhost:${port}`);
}); 