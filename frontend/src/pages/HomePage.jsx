import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBook } from '../context/BookContext';
import Card from '../components/Card';
import Alert from '../components/Alert';
import Navbar from '../components/Navbar';

const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
};

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { books, loading, error, fetchFeaturedBooks } = useBook();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchFeaturedBooks();
    }, [isAuthenticated, navigate]);

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
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Featured Books</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <Card
                            key={book._id}
                            book={book}
                            title={book.title}
                            description={book.description}
                            imageUrl={book.imageUrl}
                            price={book.price}
                            rating={book.avgRating}
                            author={book.author}
                            category={book.category}
                            publishedYear={book.publishedYear}
                            reviews={book.reviews}
                            showReviews={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage; 