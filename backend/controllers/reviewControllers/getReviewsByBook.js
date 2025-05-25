import Review from '../../models/Review.js';

const getReviewsByBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!bookId) {
      const error = new Error('Book ID is required.');
      error.statusCode = 400;
      return next(error);
    }

    const totalReviews = await Review.countDocuments({ book: bookId });

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalReviews,
      page,
      totalPages: Math.ceil(totalReviews / limit),
      reviews,
    });
  } catch (error) {
    next(error); 
  }
};

export default getReviewsByBook;
