import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const BookContext = createContext();

export const useBook = () => {
    const context = useContext(BookContext);
    if (!context) {
        throw new Error('useBook must be used within a BookProvider');
    }
    return context;
};

export const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token, showAlert } = useAuth();

    const fetchFeaturedBooks = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/books/featured/get`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired');
                }
                throw new Error(data.message || 'Failed to fetch featured books');
            }

            setBooks(data.featuredBooks);
        } catch (error) {
            console.error('Error fetching featured books:', error);
            setError(error.message);
            showAlert('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const submitReview = async (bookId, reviewData) => {
        try {
            setLoading(true);
            setError(null);

            if (!token) {
                showAlert('error', 'Authentication required');
                return { success: false, error: 'Authentication required' };
            }

            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/reviews/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (response.status === 400) {
                showAlert('warning', 'You have already reviewed this book');
                return { success: false, error: 'already_reviewed' };
            }

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    showAlert('error', 'Session expired');
                    return { success: false, error: 'Session expired' };
                }
                showAlert('error', data.message || 'Failed to submit review');
                return { success: false, error: data.message || 'Failed to submit review' };
            }

            showAlert('success', 'Review submitted successfully');
            return { success: true, data };
        } catch (error) {
            console.error('Error submitting review:', error);
            setError(error.message);
            showAlert('error', error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        books,
        loading,
        error,
        fetchFeaturedBooks,
        submitReview
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );
}; 