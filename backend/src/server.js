import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import kitchenRoutes from './routes/kitchen.js';

// Load env — .env.production takes priority when NODE_ENV=production
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Trust Nginx reverse proxy (1 hop) — required for rate-limit to use real client IP
app.set('trust proxy', 1);

// --------------- SECURITY MIDDLEWARE ---------------

// Helmet — sets secure HTTP headers, hides X-Powered-By
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Let Nginx handle CSP
}));

// Explicitly hide x-powered-by (helmet does this too, belt-and-suspenders)
app.disable('x-powered-by');

// Rate limiting — relaxed in dev, strict in production
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' }
});

// --------------- CORE MIDDLEWARE ---------------

app.use(express.json({ limit: '10kb' }));

// CORS — in production, only allow the Nginx frontend origin
const allowedOrigins = isProduction
  ? [process.env.CORS_ORIGIN || 'http://localhost']
  : [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://192.168.29.136:5173',
    'http://192.168.29.136:5174'
  ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// --------------- ROUTES ---------------

// Apply rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/menu', apiLimiter, menuRoutes);
app.use('/api/cart', apiLimiter, cartRoutes);
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/kitchen', apiLimiter, kitchenRoutes);

// Health check (no rate limit)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Detailed status endpoint for dashboard
app.get('/api/status', async (req, res) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();

  let dbStatus = 'down';
  let dbLatency = null;
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - start;
    dbStatus = 'up';
  } catch (e) {
    dbStatus = 'down';
  }

  res.json({
    server: {
      status: 'up',
      uptime: Math.floor(uptime),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    },
    database: {
      status: dbStatus,
      latencyMs: dbLatency
    },
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024)
    }
  });
});

// --------------- ERROR HANDLING ---------------

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// --------------- START SERVER ---------------

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✓ Database connected');
    console.log(`✓ Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ CORS origin: ${allowedOrigins.join(', ')}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// --------------- GRACEFUL SHUTDOWN ---------------

let isShuttingDown = false;

process.on('SIGINT', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('\n⚠️  Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('\n⚠️  SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});
