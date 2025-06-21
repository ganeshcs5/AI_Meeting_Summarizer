# AI Meeting Summarizer

An AI-powered application that generates summaries, action items, and sentiment analysis from meeting recordings or YouTube videos. Now with user authentication and profile management.

## Features

- **User Authentication**: Secure registration and login system
- **Profile Management**: View and update user profile information
- **Upload Audio Files**: From meetings with drag-and-drop support
- **Process YouTube Videos**: Generate summaries from YouTube URLs
- **Generate Comprehensive Summaries**: AI-powered content analysis
- **Extract Action Items**: Automatic task identification
- **Perform Sentiment Analysis**: Emotional tone analysis
- **Modern, Responsive React UI**: Built with Tailwind CSS
- **Protected Routes**: Secure access to application features

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite (for user management)
- **Authentication**: JWT tokens, bcrypt password hashing
- **AI**: OpenAI Whisper API (transcription), GPT-4 (summarization)
- **Additional**: ytdl-core (YouTube processing)

## Screenshots

![Application Interface](Screenshot%202025-06-17%20at%206.59.00%20PM.png)
*Main application interface showing the upload and processing options*

![Results View](Screenshot%202025-06-17%20at%206.40.31%20PM.png)
*Results view showing the generated summary, action items, and sentiment analysis*

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd AI_Meeting_Summarizer
```

2. Install backend dependencies:
```bash
npm install
```

3. Install React client dependencies:
```bash
npm run install-client
```

4. Create a `.env` file in the root directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_key_here
PORT=3001
```

5. Create the uploads directory:
```bash
mkdir uploads
```

6. Start the development servers:
```bash
# Start both backend and frontend in development mode
npm run dev-full

# Or start them separately:
# Backend only: npm run dev (runs on port 3001)
# Frontend only: npm run client (runs on port 3000)
```

The React application will be available at `http://localhost:3000` and the backend API at `http://localhost:3001`

## Authentication

### Registration
- Username: 3-30 characters, letters, numbers, and underscores only
- Email: Valid email address
- Password: Minimum 6 characters with uppercase, lowercase, and number

### Login
- Use your registered email and password to sign in
- JWT tokens are automatically managed and stored securely

### Profile Management
- View your profile information
- Update username and email
- See account creation date and user ID

## Production Build

To build the React app for production:

```bash
npm run build
```

This will create a `build` folder in the client directory that the Express server will serve.

## Usage

1. **Register/Login**: Create an account or sign in to access the application
2. **Upload Audio File**:
   - Click "Choose Audio File" or drag and drop an audio file
   - Supported formats: MP3, WAV, M4A
   - The file will be automatically processed
3. **Process YouTube Video**:
   - Paste a YouTube URL in the input field
   - Click "Process Video"
4. **View Results**:
   - Summary of the meeting/video content
   - List of action items
   - Sentiment analysis
5. **Manage Profile**: Click the "Profile" button to view and edit your account information

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Login user
- `GET /api/auth/profile`: Get current user profile (protected)
- `PUT /api/auth/profile`: Update user profile (protected)

### Protected Endpoints (require authentication)
- `POST /api/upload`: Upload and process audio files
  - Accepts multipart/form-data with 'audio' field
  - Returns JSON with summary, action items, and sentiment

- `POST /api/youtube`: Process YouTube videos
  - Accepts JSON with 'url' field
  - Returns JSON with summary, action items, and sentiment

### Public Endpoints
- `GET /api/health`: Health check endpoint

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

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all user inputs
- **Protected Routes**: API endpoints require valid authentication
- **SQL Injection Protection**: Parameterized queries for database operations

## Project Structure

```
AI_Meeting_Summarizer/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # React components
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   └── ...
│   └── package.json       # Frontend dependencies
├── services/              # Backend services
│   ├── auth.js           # Authentication utilities
│   ├── authRoutes.js     # Authentication routes
│   ├── database.js       # Database operations
│   ├── aiProcessor.js    # AI processing
│   └── youtubeProcessor.js # YouTube processing
├── uploads/               # Uploaded files (gitignored)
├── users.db              # SQLite database (gitignored)
├── server.js             # Express server
├── package.json          # Backend dependencies
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 