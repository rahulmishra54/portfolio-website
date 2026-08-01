export default (err, req, res, next) => {
  const statusCode = err.status || 500;
  const response = {
    status: statusCode,
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
