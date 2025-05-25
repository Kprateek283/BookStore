import express from 'express';
import loginUser from '../controllers/authControllers/loginUser.js';
import registerUser from '../controllers/authControllers/registerUser.js';
//import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
// router.post('/logout', authMiddleware, logoutUser);

export default router;
