import path from 'path';
import Book from '../../models/Book.js';

const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/dnwfwdumf/image/upload/v1748079152/03_janwsq.jpg';

const createBook = async (req, res, next) => {
  try {
    const { title, author, description, category, publishedYear } = req.body;

    if (!title || !author) {
      const error = new Error('Title and author are required.');
      error.statusCode = 400;
      return next(error);
    }

    if (!req.files || !req.files.pdf || req.files.pdf.length === 0) {
      const error = new Error('PDF file is required.');
      error.statusCode = 400;
      return next(error);
    }

    const pdfFile = req.files.pdf[0];

    // Check if image file is provided
    let imageUrl = DEFAULT_IMAGE_URL;
    let imagePublicId = null;

    if (req.files.image && req.files.image.length > 0) {
      const imageFile = req.files.image[0];
      imageUrl = imageFile.path;
      imagePublicId = imageFile.filename;
    }

    const newBook = new Book({
      title,
      author,
      description,
      category: Array.isArray(category) ? category : [category],
      publishedYear,
      imageUrl,
      imagePublicId,
      pdfUrl: pdfFile.path,
      pdfPublicId: pdfFile.filename,
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      message: 'Book created successfully',
      book: savedBook,
    });
  } catch (error) {
    next(error);
  }
};

export default createBook;
