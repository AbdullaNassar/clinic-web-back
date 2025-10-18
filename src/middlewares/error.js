// Not Found Middleware
export const notFound = (req, res, next) => {
  const error = new Error(`not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  // Determine the status code: if it's 200 (default), change to 500; otherwise, keep the current status
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // Only include the stack trace in development environment
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
