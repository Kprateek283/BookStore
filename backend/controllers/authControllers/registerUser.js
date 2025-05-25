import bcrypt from 'bcryptjs';
import User from '../../models/User.js';

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, adminKey } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      const error = new Error('All fields are required.');
      error.statusCode = 400;
      return next(error);
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      const error = new Error(
        'Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'
      );
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email is already registered.');
      error.statusCode = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let role = 'user';
    if (adminKey && adminKey === process.env.ADMIN_SECRET_KEY) {
      role = 'admin';
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully.',
      user: { username, email, role },
    });
  } catch (error) {
    next(error);
  }
};

export default registerUser;
