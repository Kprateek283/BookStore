import Book from '../../models/Book.js';
import Review from '../../models/Review.js';  // Assuming you have a Review model

const featuredBooks = async (req, res, next) => {
  try {
    // Aggregate reviews to get average rating per book
    const ratings = await Review.aggregate([
      {
        $group: {
          _id: '$book',                // group by book ID
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    // Convert ratings array to a map for quick lookup
    const ratingMap = {};
    ratings.forEach(r => {
      ratingMap[r._id.toString()] = r.avgRating;
    });

    // Fetch books, add avgRating from map, default 0 if no rating
    const books = await Book.find().lean();

    const booksWithRatings = books.map(book => ({
      ...book,
      avgRating: ratingMap[book._id.toString()] || 0,
    }));

    // Sort by avgRating descending, then by publishedYear descending (latest first)
    booksWithRatings.sort((a, b) => {
      if (b.avgRating === a.avgRating) {
        return (b.publishedYear || 0) - (a.publishedYear || 0);
      }
      return b.avgRating - a.avgRating;
    });

    // Return top 5 featured books
    const featured = booksWithRatings.slice(0, 5);

    res.status(200).json({
      message: 'Featured books fetched successfully',
      featuredBooks: featured,
    });
  } catch (error) {
    next(error);
  }
};

export default featuredBooks;
