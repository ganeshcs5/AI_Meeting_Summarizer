const { OpenAI } = require('openai');
const fs = require('fs');

class AIProcessor {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async transcribeAudio(filePath) {
        try {
            const audioFile = fs.createReadStream(filePath);
            const transcription = await this.openai.audio.transcriptions.create({
                file: audioFile,
                model: "whisper-1",
                response_format: "text"
            });
            return transcription;
        } catch (error) {
            console.error('Error in transcription:', error);
            throw new Error('Failed to transcribe audio');
        }
    }

    async generateSummary(transcription) {
        try {
            const prompt = `Please analyze the following meeting transcript and provide:
1. A concise summary of the main points
2. A list of action items (if any)
3. The overall sentiment of the meeting

Transcript:
${transcription}

Please format your response as JSON with the following structure:
{
    "summary": "brief summary here",
    "actionItems": ["item1", "item2", ...],
    "sentiment": "overall sentiment analysis"
}`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional meeting summarizer. Extract key information and format it as requested."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error in summary generation:', error);
            throw new Error('Failed to generate summary');
        }
    }

    async processAudio(filePath) {
        try {
            // Step 1: Transcribe the audio
            const transcription = await this.transcribeAudio(filePath);
            
            // Step 2: Generate summary and analysis
            const analysis = await this.generateSummary(transcription);
            
            return {
                transcription,
                ...analysis
            };
        } catch (error) {
            console.error('Error in audio processing:', error);
            throw error;
        }
    }
}

module.exports = new AIProcessor(); 