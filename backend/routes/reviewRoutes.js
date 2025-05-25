import express from 'express';
import authMiddleware from '../middleware/auth.js';
import createReview from '../controllers/reviewControllers/createReview.js';
import getReviewsByBook from '../controllers/reviewControllers/getReviewsByBook.js';

const router = express.Router();

// Get all reviews for a book
router.get('/:bookId', authMiddleware, getReviewsByBook);

// Create a new review for a book
router.post('/:bookId', authMiddleware, createReview);

export default router;
