import Book from '../../models/Book.js';

const getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId)
      .populate({
        path: 'reviews',
        select: 'rating comment user createdAt',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      return next(error);
    }

    // Directly send the URLs stored in DB (no signing)
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    error.statusCode = 500;
    next(error);
  }
};

export default getBookById;
