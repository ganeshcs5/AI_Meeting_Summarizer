import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Breadcrumb = ({ currentPage, onNavigate, onLogout }) => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        {
            id: 'meeting-summarizer',
            label: 'Meeting Summarizer',
            description: 'AI-powered meeting and video summarization',
            icon: '🎯',
            active: currentPage === 'meeting-summarizer'
        },
        {
            id: 'chat-assistant',
            label: 'AI Chat Assistant',
            description: 'Intelligent conversation and support',
            icon: '💬',
            active: false
        },
        {
            id: 'document-analyzer',
            label: 'Document Analyzer',
            description: 'AI-powered document processing and analysis',
            icon: '📄',
            active: false
        },
        {
            id: 'image-generator',
            label: 'Image Generator',
            description: 'AI-powered image creation and editing',
            icon: '🎨',
            active: false
        },
        {
            id: 'code-assistant',
            label: 'Code Assistant',
            description: 'AI-powered coding and development help',
            icon: '💻',
            active: false
        }
    ];

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuItemClick = (itemId) => {
        if (itemId === 'meeting-summarizer') {
            onNavigate('meeting-summarizer');
        } else {
            // For future AI projects - you can add navigation logic here
            alert(`${menuItems.find(item => item.id === itemId)?.label} - Coming Soon!`);
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo and current page */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🤖</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">AI Hub</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                            <span className="text-gray-400 dark:text-gray-500">/</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                                {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    {/* Center - Project menu */}
                    <div className="flex-1 flex justify-center">
                        <div className="relative">
                            <button
                                onClick={handleMenuToggle}
                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            >
                                <span>AI Projects</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown menu */}
                            {isMenuOpen && (
                                <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                    <div className="py-2">
                                        {menuItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleMenuItemClick(item.id)}
                                                className={`w-full flex items-start space-x-3 px-4 py-3 text-left transition-colors ${
                                                    item.active 
                                                        ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500' 
                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                <span className="text-xl">{item.icon}</span>
                                                <div className="flex-1">
                                                    <div className={`font-medium ${
                                                        item.active 
                                                            ? 'text-blue-700 dark:text-blue-300' 
                                                            : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                        {item.label}
                                                    </div>
                                                    <div className={`text-sm ${
                                                        item.active 
                                                            ? 'text-blue-600 dark:text-blue-400' 
                                                            : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                        {item.description}
                                                    </div>
                                                </div>
                                                {item.active && (
                                                    <span className="text-blue-500 dark:text-blue-400">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side - User menu and theme toggle */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                            <span>Welcome,</span>
                            <span className="font-medium text-gray-900 dark:text-white">{user?.username}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ThemeToggle />
                            <button
                                onClick={() => onNavigate('profile')}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="hidden sm:inline">Profile</span>
                            </button>
                            <button
                                onClick={onLogout}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile breadcrumb */}
            <div className="md:hidden px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">AI Hub</span>
                    <span className="text-gray-400 dark:text-gray-500">/</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                        {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumb; 