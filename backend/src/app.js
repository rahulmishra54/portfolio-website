import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimiter from './middleware/rateLimiter.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Trust reverse proxies (for deployment on platforms like Heroku, Vercel, or Nginx).
app.set('trust proxy', 1);

// Standard security and middleware setup for a production-ready Express app.
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));


// Base router for API modules and future portfolio endpoints.
app.use('/api', routes);

// Health check endpoint (useful for uptime checks) — lightweight and public.
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Handle unmatched routes and centralize error handling.
app.use(notFound);
app.use(errorHandler);

export default app;
