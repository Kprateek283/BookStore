import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const CreateBookPage = () => {
    const navigate = useNavigate();
    const { token, showAlert } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        category: '',
        publishedYear: new Date().getFullYear(),
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            showAlert('error', 'Please select a valid PDF file');
            e.target.value = null;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImageFile(file);
        } else {
            showAlert('error', 'Please select a valid image file (JPEG or PNG)');
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.author || !pdfFile) {
            showAlert('error', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('publishedYear', formData.publishedYear);
            formDataToSend.append('pdfFile', pdfFile);
            if (imageFile) {
                formDataToSend.append('imageFile', imageFile);
            }

            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/books`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Failed to create book');
            }

            showAlert('success', 'Book created successfully');
            navigate('/books');
        } catch (error) {
            console.error('Error creating book:', error);
            showAlert('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Book</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                                Author <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
                                Published Year
                            </label>
                            <input
                                type="number"
                                id="publishedYear"
                                name="publishedYear"
                                value={formData.publishedYear}
                                onChange={handleInputChange}
                                min="1900"
                                max={new Date().getFullYear()}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700">
                                PDF File <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id="pdfFile"
                                accept=".pdf"
                                onChange={handlePdfChange}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
                                Cover Image (Optional)
                            </label>
                            <input
                                type="file"
                                id="imageFile"
                                accept="image/jpeg,image/png"
                                onChange={handleImageChange}
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Book'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBookPage; 