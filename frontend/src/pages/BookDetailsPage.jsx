import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getBookById, submitReview } = useBook();
    const { token, showAlert } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/books/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch book details');
                }
                
                setBook(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id, token]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/reviews/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (response.status === 400) {
                showAlert('warning', 'You have already reviewed this book');
                setShowReviewForm(false);
                return;
            }

            const data = await response.json();
            if (!response.ok) {
                showAlert('error', data.message || 'Failed to submit review');
                return;
            }

            showAlert('success', 'Review submitted successfully');
            setShowReviewForm(false);
            setReviewData({ rating: 5, comment: '' });
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
            showAlert('error', error.message);
        }
    };

    const handleRatingChange = (e) => {
        setReviewData(prev => ({
            ...prev,
            rating: parseInt(e.target.value)
        }));
    };

    const handleCommentChange = (e) => {
        setReviewData(prev => ({
            ...prev,
            comment: e.target.value
        }));
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
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500 text-xl">Book not found</div>
            </div>
        );
    }

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3">
                            <img 
                                src={book.imageUrl} 
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-2/3 p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                            
                            <div className="mb-4">
                                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mr-2">
                                    {book.category.join(', ')}
                                </span>
                                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    Published: {book.publishedYear}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-semibold mb-2">Description</h2>
                                <p className="text-gray-700">{book.description}</p>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-semibold mb-2">Rating</h2>
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold text-yellow-500">
                                        {calculateAverageRating(book.reviews)}
                                    </span>
                                    <span className="text-gray-500 ml-2">
                                        ({book.reviews.length} reviews)
                                    </span>
                                </div>
                            </div>

                            {book.pdfUrl && (
                                <a 
                                    href={book.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Read Book
                                </a>
                            )}

                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="ml-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Give Review
                            </button>
                        </div>
                    </div>

                    {showReviewForm && (
                        <div className="p-6 border-t">
                            <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rating
                                    </label>
                                    <select
                                        value={reviewData.rating}
                                        onChange={handleRatingChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <option key={rating} value={rating}>
                                                {rating} {rating === 1 ? 'Star' : 'Stars'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Comment
                                    </label>
                                    <textarea
                                        value={reviewData.comment}
                                        onChange={handleCommentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        rows="4"
                                        placeholder="Write your review here..."
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="p-6 border-t">
                        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                        {book.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {book.reviews.map((review) => (
                                    <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">
                                                {review.user ? review.user.username : 'Anonymous'}
                                            </span>
                                            <span className="text-yellow-500">
                                                {'★'.repeat(review.rating)}
                                                {'☆'.repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No reviews yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage; 