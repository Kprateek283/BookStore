import express from 'express';
import loginUser from '../controllers/authControllers/loginUser.js';
import registerUser from '../controllers/authControllers/registerUser.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

export default router;
