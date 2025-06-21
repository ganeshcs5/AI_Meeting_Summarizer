import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = ({ onBack }) => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (formData.username.length > 30) {
            newErrors.username = 'Username must be less than 30 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const result = await updateProfile(formData);
        setIsLoading(false);

        if (result.success) {
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } else {
            setErrors({ general: result.error });
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user?.username || '',
            email: user?.email || ''
        });
        setErrors({});
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                Profile Information
                            </h3>
                            <div className="flex space-x-3">
                                <button
                                    onClick={onBack}
                                    className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Back to App
                                </button>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 transition-colors"
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {message && (
                            <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded">
                                {message}
                            </div>
                        )}

                        {errors.general && (
                            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Username
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                                errors.username ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{user?.username}</p>
                                    )}
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                                errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{user?.email}</p>
                                    )}
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Member Since
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {formatDate(user?.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        User ID
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{user?.id}</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 