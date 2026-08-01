export default (err, req, res, next) => {
  const statusCode = err.status || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const response = {
    status: statusCode,
    message: err.message || 'Internal Server Error',
  };

  // Log error on server side
  console.error('Error:', {
    message: err.message,
    status: statusCode,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (isDevelopment) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
