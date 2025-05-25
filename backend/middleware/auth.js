import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Unauthorized. No token provided.');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    console.error('Auth error:', error);
    error.statusCode = 401;
    error.message = 'Invalid or expired token.';
    next(error);
  }
};

export default authMiddleware;
