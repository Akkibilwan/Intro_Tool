/**
 * Error Handling Middleware
 */

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);
  
  // Default error response
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  // Don't expose internal errors in production
  const errorResponse = {
    success: false,
    message: process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : message
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(status).json(errorResponse);
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};

