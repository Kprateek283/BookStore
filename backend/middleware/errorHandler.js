import User from '../models/User.js';

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    error.statusCode = 500;
    next(error); 
  }
};

export default getAllUsers;
