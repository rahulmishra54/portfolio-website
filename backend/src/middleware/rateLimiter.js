import rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the deprecated X-RateLimit-* headers
  message: {
    status: 429,
    message: 'Too many requests from this IP address. Please try again later.',
  },
});
