export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('❌ Error:', err);

  // Mongoose Validation
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(v => v.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ 
      success: false, 
      message: `${field} already exists` 
    });
  }

  // Cast Error
  if (err.name === 'CastError') {
    return res.status(404).json({ 
      success: false, 
      message: 'Resource not found' 
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);