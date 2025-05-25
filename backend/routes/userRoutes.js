import express from 'express';
import authMiddleware from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import getUserById from '../controllers/userControllers/getUserById.js';
import updateUserById from '../controllers/userControllers/updateUserById.js';
import getAllUsers from '../controllers/userControllers/getAllUsers.js';

const router = express.Router();

// GET /users/:id — Get user by ID (protected)
router.get('/:id', authMiddleware, getUserById);

// PUT /users/:id — Update user by ID (protected)
router.put('/:id', authMiddleware, updateUserById);

// GET /users — Get all users (admin only)
router.get('/', authMiddleware, isAdmin, getAllUsers);

export default router;
