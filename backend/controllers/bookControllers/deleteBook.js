import Book from '../../models/Book.js';
import Review from '../../models/Review.js';
import cloudinary from '../../config/cloudinaryConfig.js';

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      const error = new Error('Book not found.');
      error.statusCode = 404;
      return next(error);
    }

    // Delete associated Cloudinary image (if exists)
    if (book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId);
    }

    // Delete associated Cloudinary PDF (if exists)
    if (book.pdfPublicId) {
      await cloudinary.uploader.destroy(book.pdfPublicId, { resource_type: 'raw' });
    }

    // Delete associated reviews
    await Review.deleteMany({ _id: { $in: book.reviews } });

    // Delete the book itself
    await book.deleteOne();

    res.status(200).json({ message: 'Book and associated reviews deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    error.statusCode = 500;
    next(error);
  }
};

export default deleteBook;
