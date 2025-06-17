# AI Meeting Summarizer

An AI-powered application that generates summaries, action items, and sentiment analysis from meeting recordings or YouTube videos.

## Features

- Upload audio files from meetings
- Process YouTube video URLs
- Generate comprehensive summaries
- Extract action items
- Perform sentiment analysis
- Modern, responsive UI
- Drag-and-drop file upload

## Screenshots

![Application Interface](Screenshot%202025-06-17%20at%206.59.00%20PM.png)
*Main application interface showing the upload and processing options*

![Results View](Screenshot%202025-06-17%20at%206.40.31%20PM.png)
*Results view showing the generated summary, action items, and sentiment analysis*

## Tech Stack

- Frontend: HTML, CSS (Tailwind), JavaScript
- Backend: Node.js, Express
- AI: OpenAI Whisper API (transcription), GPT-4 (summarization)
- Additional: ytdl-core (YouTube processing)

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd videoSummary
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

4. Create the uploads directory:
```bash
mkdir uploads
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Upload Audio File**:
   - Click "Choose Audio File" or drag and drop an audio file
   - Supported formats: MP3, WAV, M4A
   - Click "Upload and Process"

2. **Process YouTube Video**:
   - Paste a YouTube URL in the input field
   - Click "Process Video"

3. **View Results**:
   - Summary of the meeting/video content
   - List of action items
   - Sentiment analysis

## API Endpoints

- `POST /api/upload`: Upload and process audio files
  - Accepts multipart/form-data with 'audio' field
  - Returns JSON with summary, action items, and sentiment

- `POST /api/youtube`: Process YouTube videos
  - Accepts JSON with 'url' field
  - Returns JSON with summary, action items, and sentiment

## Response Format

```json
{
  "transcription": "Full transcript of the audio/video",
  "summary": "Concise summary of the content",
  "actionItems": [
    "Action item 1",
    "Action item 2",
    ...
  ],
  "sentiment": "Overall sentiment analysis"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 