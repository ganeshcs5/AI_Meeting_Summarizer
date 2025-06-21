# AI Meeting Summarizer

An intelligent application that uses AI to summarize meeting audio files and YouTube videos, extracting key points, action items, and sentiment analysis.

## Features

- **Audio File Processing**: Upload meeting audio files for AI-powered summarization
- **YouTube Video Processing**: Provide YouTube URLs to get summaries of video content
- **AI-Powered Analysis**: Get comprehensive summaries including:
  - Key discussion points
  - Action items and tasks
  - Sentiment analysis
- **User Authentication**: Secure login and registration system
- **Profile Management**: Edit user profile information
- **Dark/Light Theme**: Toggle between dark and light themes with persistent preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with React and Tailwind CSS

## Screenshots

![Login Screen](screenshots/login.png)
*Secure authentication with dark/light theme support*

![Main Application](screenshots/main-app.png)
*AI-powered meeting summarization interface*

## Technology Stack

### Frontend
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Context API**: State management for authentication and themes
- **Local Storage**: Persistent theme preferences

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **SQLite**: Lightweight database
- **bcrypt**: Password hashing
- **JWT**: Token-based authentication
- **Multer**: File upload handling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_Meeting_Summarizer
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Build the React app**
   ```bash
   npm run build
   cd ..
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3001`

## Usage

### Authentication
1. Register a new account or sign in with existing credentials
2. Your theme preference will be automatically saved and restored on future logins

### Theme Customization
- Click the theme toggle button (sun/moon icon) in the navigation bar
- Your theme preference is automatically saved to localStorage
- The selected theme persists across browser sessions and logins

### Meeting Summarization
1. **Audio Files**: Drag and drop or click to upload audio files
2. **YouTube Videos**: Paste a YouTube URL and click "Process Video"
3. View the AI-generated summary, action items, and sentiment analysis

### Profile Management
- Access your profile from the navigation bar
- Edit username and email information
- View account creation date and user ID

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### File Processing
- `POST /api/upload` - Upload audio files
- `POST /api/youtube` - Process YouTube videos

## Project Structure

```
AI_Meeting_Summarizer/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # Context providers
│   │   └── App.js
│   └── package.json
├── uploads/               # Uploaded files directory
├── database.db           # SQLite database
├── server.js            # Express server
└── package.json
```

## Features in Detail

### Dark/Light Theme System
- **Automatic Detection**: Theme preference is saved in localStorage
- **Persistent Storage**: Theme choice survives browser restarts and logins
- **Smooth Transitions**: CSS transitions for theme switching
- **Comprehensive Styling**: All components support both themes
- **Accessibility**: Proper contrast ratios for both themes

### Authentication System
- **Secure Registration**: Username, email, and password validation
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt for secure password storage
- **Profile Management**: Edit user information
- **Protected Routes**: API endpoints require authentication

### AI Integration
- **Audio Processing**: Support for various audio formats
- **YouTube Integration**: Direct video URL processing
- **Comprehensive Analysis**: Summary, action items, and sentiment
- **Error Handling**: Graceful error handling for processing failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 