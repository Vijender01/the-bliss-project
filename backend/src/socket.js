import { Server } from 'socket.io';
import { verifyToken } from './utils/jwt.js';

let io = null;

export function initSocket(httpServer, allowedOrigins) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Auth middleware — verify JWT on connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Invalid token'));
    }
    socket.user = decoded;
    next();
  });

  io.on('connection', (socket) => {
    const { userId, role, kitchenId } = socket.user;
    console.log(`⚡ Socket connected: ${role} (user ${userId})`);

    // Join role-based rooms
    if (role === 'ADMIN') {
      socket.join('admin');
    }
    if (role === 'KITCHEN_OWNER' && kitchenId) {
      socket.join(`kitchen_${kitchenId}`);
    }
    // Every user joins their own room for personal notifications
    socket.join(`user_${userId}`);

    socket.on('disconnect', () => {
      console.log(`⚡ Socket disconnected: ${role} (user ${userId})`);
    });
  });

  console.log('✓ Socket.io initialized');
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
