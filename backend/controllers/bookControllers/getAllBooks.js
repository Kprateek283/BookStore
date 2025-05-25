import Book from '../../models/Book.js';

const getAllBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments();

    const books = await Book.find()
      .populate({
        path: 'reviews',
        select: 'rating comment user createdAt',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // No signed URLs, just send URLs stored in DB
    // books already contain imageUrl and pdfUrl as strings

    res.status(200).json({
      total: totalBooks,
      page,
      totalPages: Math.ceil(totalBooks / limit),
      books,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    error.statusCode = 500;
    next(error);
  }
};

export default getAllBooks;
