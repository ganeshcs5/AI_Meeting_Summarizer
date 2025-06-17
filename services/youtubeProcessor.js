const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const aiProcessor = require('./aiProcessor');

class YouTubeProcessor {
    constructor() {
        this.uploadDir = path.join(__dirname, '../uploads');
    }

    async downloadAudio(url) {
        try {
            // Generate a unique filename
            const timestamp = Date.now();
            const outputPath = path.join(this.uploadDir, `youtube_${timestamp}.mp3`);

            // Use yt-dlp to download audio
            const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`;
            
            console.log('Downloading YouTube video...');
            await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error downloading YouTube video:', error);
                        reject(new Error('Failed to download YouTube video'));
                        return;
                    }
                    console.log('Download completed successfully');
                    resolve();
                });
            });

            // Verify the file exists
            try {
                await fs.access(outputPath);
                console.log('Audio file downloaded successfully');
                return outputPath;
            } catch (err) {
                throw new Error('Downloaded file not found');
            }
        } catch (error) {
            console.error('Error in downloadAudio:', error);
            throw error;
        }
    }

    async processVideo(url) {
        try {
            console.log('Starting YouTube video processing for:', url);
            
            // Step 1: Download audio
            const audioPath = await this.downloadAudio(url);
            console.log('Audio downloaded successfully');
            
            // Step 2: Process audio using AI
            const result = await aiProcessor.processAudio(audioPath);
            console.log('Audio processed successfully');
            
            // Step 3: Clean up downloaded file
            await fs.unlink(audioPath);
            console.log('Temporary file cleaned up');
            
            return result;
        } catch (error) {
            console.error('Error processing YouTube video:', error);
            throw error;
        }
    }
}

module.exports = new YouTubeProcessor(); 