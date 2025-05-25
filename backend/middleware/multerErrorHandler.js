const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof Error && err.message.includes('File too large')) {
    return res.status(400).json({ message: 'File size should not exceed 4 MB.' });
  }

  if (err instanceof Error && err.message.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }

  next(err); // Pass other errors to the centralized error handler
};

export default multerErrorHandler;
