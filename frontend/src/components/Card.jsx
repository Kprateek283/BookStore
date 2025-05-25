import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const Card = ({
    title,
    description,
    imageUrl,
    buttonText = 'View Details',
    buttonVariant = 'default',
    onButtonClick,
    className = '',
    showButton = true,
    titleLink = '#',
    imageAlt = 'Card image',
    author,
    category,
    publishedYear,
    rating,
    reviews,
    children,
    book,
    showReviews = true,
    onDelete
}) => {
    const navigate = useNavigate();
    const { user, token, showAlert } = useAuth();

    const handleViewDetails = () => {
        navigate(`/books/${book._id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/books/${book._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete book');
                }

                showAlert('success', 'Book deleted successfully');
                if (onDelete) {
                    onDelete(book._id);
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                showAlert('error', error.message);
            }
        }
    };

    return (
        <div className={`max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
            {imageUrl && (
                <a href={titleLink}>
                    <img 
                        className="rounded-t-lg w-full h-48 object-cover" 
                        src={imageUrl} 
                        alt={imageAlt} 
                    />
                </a>
            )}
            
            <div className="p-5">
                {title && (
                    <a href={titleLink}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {title}
                        </h5>
                    </a>
                )}
                
                {author && (
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        By {author}
                    </p>
                )}

                {description && (
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="mb-3 space-y-1">
                    {category && category.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {category.map((cat, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}

                    {publishedYear && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Published: {publishedYear}
                        </p>
                    )}

                    {showReviews && (
                        <div className="flex items-center space-x-2">
                            {rating !== undefined && (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                        {rating} ({reviews?.length || 0} reviews)
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {children}

                <div className="flex gap-2">
                    {showButton && (
                        <Button
                            variant={buttonVariant}
                            onClick={handleViewDetails}
                            className="inline-flex items-center justify-center flex-1"
                        >
                            {buttonText}
                            <svg 
                                className="rtl:rotate-180 w-3.5 h-3.5 ms-2" 
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 14 10"
                            >
                                <path 
                                    stroke="currentColor" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M1 5h12m0 0L9 1m4 4L9 9"
                                />
                            </svg>
                        </Button>
                    )}
                    {user?.role === 'admin' && (
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                            <svg 
                                className="w-4 h-4 ms-2" 
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 18 20"
                            >
                                <path 
                                    stroke="currentColor" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
                                />
                            </svg>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card; 