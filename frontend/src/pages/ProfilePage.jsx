import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, logoutUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Auth Context User:', user);
        console.log('User ID:', user?.id);
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!user?.id) {
            setError('User ID not found');
            setLoading(false);
            return;
        }
        fetchProfileData();
    }, [isAuthenticated, navigate, user]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching profile for user ID:', user.id);
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired');
                }
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();
            console.log('Profile Data:', data);
            setProfileData(data);
        } catch (error) {
            console.error('Profile fetch error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-3xl text-blue-600">
                                    {profileData?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profileData?.name}</h1>
                                <p className="text-gray-600">{profileData?.email}</p>
                                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full mt-2">
                                    {profileData?.role}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="text-gray-900">{profileData?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Role</p>
                                    <p className="text-gray-900 capitalize">{profileData?.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="text-gray-900">
                                        {new Date(profileData?.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {profileData?.reviews && profileData.reviews.length > 0 && (
                            <div className="border-t border-gray-200 pt-6 mt-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Reviews</h2>
                                <div className="space-y-4">
                                    {profileData.reviews.map((review) => (
                                        <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-gray-900">{review.book?.title}</h3>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                                    </svg>
                                                    <span className="ml-1 text-sm text-gray-600">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600">{review.comment}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 