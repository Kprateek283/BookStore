import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      return next(error);
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{6,}$/;
      if (!passwordRegex.test(password)) {
        const error = new Error(
          'Password must be at least 6 characters long and include at least one uppercase letter and one special character.'
        );
        error.statusCode = 400;
        return next(error);
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: 'User updated successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    error.statusCode = 500;
    next(error);
  }
};

export default updateUserById;
