import Review from '../../models/Review.js';
import Book from '../../models/Book.js';

const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { bookId } = req.params;
    const userId = req.user.userId;

    if (!rating || !comment) {
      const error = new Error('Rating and comment are required.');
      error.statusCode = 400;
      return next(error);
    }

    const book = await Book.findById(bookId);
    if (!book) {
      const error = new Error('Book not found.');
      error.statusCode = 404;
      return next(error);
    }

    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      const error = new Error('You have already reviewed this book.');
      error.statusCode = 400;
      return next(error);
    }

    const newReview = new Review({
      book: bookId,
      user: userId,
      rating,
      comment,
    });

    await newReview.save();

    book.reviews.push(newReview._id);
    await book.save();

    res.status(201).json({ message: 'Review added successfully.', review: newReview });
  } catch (error) {
    next(error); 
  }
};

export default createReview;
