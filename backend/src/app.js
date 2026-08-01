import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
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

// Health check endpoint (useful for uptime checks) — lightweight and public.
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// DEBUG endpoint - shows connection and environment status
app.get('/api/debug', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'unknown',
    vercel: process.env.VERCEL === '1' ? 'yes' : 'no',
    mongodb: {
      status: statusMap[mongoStatus],
      uri: process.env.MONGODB_URI ? 'set' : 'missing',
      connected: mongoStatus === 1,
    },
    env_vars: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      JWT_SECRET: !!process.env.JWT_SECRET,
    },
    node: {
      version: process.version,
      platform: process.platform,
    },
    timestamp: new Date().toISOString(),
  });
});

// Base router for API modules and future portfolio endpoints.
app.use('/api', routes);

// Handle unmatched routes and centralize error handling.
app.use(notFound);
app.use(errorHandler);

export default app;
