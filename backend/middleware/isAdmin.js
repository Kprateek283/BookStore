const isAdmin = (req, res, next) => {
  try {
    if (req.user?.role !== 'admin') {
      const error = new Error('Access denied. Admins only.');
      error.statusCode = 403;
      return next(error);
    }
    next();
  } catch (error) {
    console.error('Admin check failed:', error);
    error.statusCode = 500;
    error.message = 'Server error during admin verification.';
    next(error);
  }
};

export default isAdmin;
