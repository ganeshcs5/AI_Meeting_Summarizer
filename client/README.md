# AI Meeting Summarizer - React Client

This is the React frontend for the AI Meeting Summarizer application.

## Available Scripts

In the client directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Features

- **File Upload**: Drag and drop or click to upload audio files
- **YouTube Processing**: Enter YouTube URLs to process videos
- **Real-time Loading States**: Visual feedback during processing
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS for a clean, modern look

## Development

The React app communicates with the Node.js backend through API endpoints:
- `POST /api/upload` - For audio file uploads
- `POST /api/youtube` - For YouTube video processing

The app is configured to proxy API requests to the backend server running on port 3000. 