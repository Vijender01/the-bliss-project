import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://192.168.29.136:5173',
    'http://192.168.29.136:5174'
  ],
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✓ Database connected');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Accessible on all interfaces: 0.0.0.0:${PORT}`);
      console.log(`✓ Phone access: http://192.168.29.136:${PORT}`);
      console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL}`);
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

// Ignore SIGINT signal during startup (Windows shell sends it)
// Only graceful shutdown will close the server
let isShuttingDown = false;

process.on('SIGINT', async () => {
  if (isShuttingDown) return; // Prevent multiple calls
  isShuttingDown = true;
  console.log('\n⚠️  Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Keep process alive with interval
setInterval(() => {
  // Keep the process from exiting
}, 30000);
