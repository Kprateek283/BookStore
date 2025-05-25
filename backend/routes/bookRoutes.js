import express from 'express';
const router = express.Router();

import getAllBooks from '../controllers/bookControllers/getAllBooks.js';
import getBookById from '../controllers/bookControllers/getBookById.js';
import createBook from '../controllers/bookControllers/createBook.js';
import deleteBook from '../controllers/bookControllers/deleteBook.js';
import authMiddleware from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import upload from '../middleware/multerMiddleware.js';
import featuredBooks from '../controllers/bookControllers/featuredBooks.js';

// Place featured route before :id route
router.get('/featured/get', authMiddleware, featuredBooks);

router.get('/', authMiddleware, getAllBooks);
router.get('/:id', authMiddleware, getBookById);

router.post(
  '/',
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  createBook
);

router.delete('/:id', authMiddleware, isAdmin, deleteBook);

export default router;
