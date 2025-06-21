import React, { useState, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Breadcrumb from './components/Breadcrumb';
import './App.css';

function App() {
  const { loading, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAuth, setShowAuth] = useState('login'); // 'login' or 'register'
  const [currentPage, setCurrentPage] = useState('meeting-summarizer'); // 'meeting-summarizer' or 'profile'
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) {
      alert('Please select an audio file');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    try {
      setIsLoading(true);
      setResults(null);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Please log in to upload files');
          return;
        }
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleYouTubeSubmit = async (e) => {
    e.preventDefault();
    const url = youtubeUrl.trim();
    if (!url) {
      alert('Please enter a YouTube URL');
      return;
    }

    try {
      setIsLoading(true);
      setResults(null);
      
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Please log in to process YouTube videos');
          return;
        }
        throw new Error('Processing failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing YouTube video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('meeting-summarizer');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication screens if not logged in
  if (!isAuthenticated) {
    return showAuth === 'login' ? (
      <Login onSwitchToRegister={() => setShowAuth('register')} />
    ) : (
      <Register onSwitchToLogin={() => setShowAuth('login')} />
    );
  }

  // Show profile page if requested
  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Breadcrumb 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
        />
        <Profile onBack={() => handleNavigate('meeting-summarizer')} />
      </div>
    );
  }

  // Main application interface
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Breadcrumb 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">AI Meeting Summarizer</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload meeting audio or provide a YouTube link to get an AI-powered summary</p>
        </header>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Upload Audio File</h2>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <button
                onClick={handleChooseFile}
                className="cursor-pointer bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                Choose Audio File
              </button>
              <p className="text-gray-500 dark:text-gray-400 mt-2">or drag and drop your file here</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">YouTube Video</h2>
            <form onSubmit={handleYouTubeSubmit} className="space-y-4">
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Enter YouTube URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="bg-green-500 dark:bg-green-600 text-white px-6 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
              >
                Process Video
              </button>
            </form>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Processing your request...</p>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Results</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Summary</h3>
                <p className="text-gray-700 dark:text-gray-300">{results.summary || 'No summary available'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Action Items</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                  {results.actionItems && results.actionItems.length > 0 ? (
                    results.actionItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <li>No action items found</li>
                  )}
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Sentiment Analysis</h3>
                <p className="text-gray-700 dark:text-gray-300">{results.sentiment || 'No sentiment analysis available'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 