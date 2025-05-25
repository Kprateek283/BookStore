import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Alert from '../components/Alert';
import Navbar from '../components/Navbar';

const BOOK_CATEGORIES = [
    'Fantasy',
    'Fiction',
    'Horror',
    'Comedy',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Thriller',
    'Biography',
    'History'
];

const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
};

const BooksPage = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, logoutUser } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minRating, setMinRating] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchBooks();
    }, [isAuthenticated, navigate]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/books`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired');
                }
                throw new Error('Failed to fetch books');
            }

            const data = await response.json();
            console.log('Books API Response:', data);
            
            // Check if data.books exists, if not, use the data directly
            const booksData = data.books || data;
            console.log('Books data to be set:', booksData);
            
            setBooks(booksData);
        } catch (error) {
            console.error('Books fetch error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // Filter and search functions
    const filteredBooks = books.filter(book => {
        if (!book) return false;
        
        const matchesSearch = searchQuery === '' || 
            (book.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (book.author?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (book.publishedYear?.toString() || '').includes(searchQuery);

        const matchesCategory = selectedCategory === '' || 
            (Array.isArray(book.category) && book.category.some(cat => 
                (cat?.toLowerCase() || '').includes(selectedCategory.toLowerCase())
            ));

        const bookRating = calculateAverageRating(book.reviews);
        const matchesRating = minRating === 0 || bookRating >= minRating;

        return matchesSearch && matchesCategory && matchesRating;
    });

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
                {/* Search and Filter Section */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search
                            </label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search by title, author, or year..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {BOOK_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Rating
                            </label>
                            <select
                                id="rating"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={minRating}
                                onChange={(e) => setMinRating(Number(e.target.value))}
                            >
                                <option value="0">Any Rating</option>
                                <option value="1">1+ Stars</option>
                                <option value="2">2+ Stars</option>
                                <option value="3">3+ Stars</option>
                                <option value="4">4+ Stars</option>
                                <option value="5">5 Stars</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <Card
                            key={book._id}
                            book={book}
                            title={book.title}
                            description={book.description}
                            imageUrl={book.imageUrl}
                            price={book.price}
                            rating={calculateAverageRating(book.reviews)}
                            author={book.author}
                            category={book.category}
                            publishedYear={book.publishedYear}
                            reviews={book.reviews}
                        />
                    ))}
                </div>

                {/* No Results Message */}
                {filteredBooks.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BooksPage; 