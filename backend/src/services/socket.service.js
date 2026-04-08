const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

// Store active connections
const activeConnections = new Map();

// Initialize Socket.IO
const initializeSocketIO = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
    
    try {
      // Verify token (in a real app, use JWT_SECRET from env)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    
    // Store connection
    activeConnections.set(socket.user.id, socket);
    
    // Join user-specific room
    socket.join(`user:${socket.user.id}`);
    
    // Join role-specific rooms
    if (socket.user.role) {
      socket.join(`role:${socket.user.role}`);
    }
    
    // Join cooperative-specific room if applicable
    if (socket.user.cooperativeId) {
      socket.join(`cooperative:${socket.user.cooperativeId}`);
    }
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
      activeConnections.delete(socket.user.id);
    });
  });

  return io;
};

// Send notification to specific user
const sendNotificationToUser = (userId, notification) => {
  const io = global.io;
  if (!io) return;
  
  io.to(`user:${userId}`).emit('notification', notification);
};

// Send notification to users with specific role
const sendNotificationToRole = (role, notification) => {
  const io = global.io;
  if (!io) return;
  
  io.to(`role:${role}`).emit('notification', notification);
};

// Send notification to all users in a cooperative
const sendNotificationToCooperative = (cooperativeId, notification) => {
  const io = global.io;
  if (!io) return;
  
  io.to(`cooperative:${cooperativeId}`).emit('notification', notification);
};

// Send dashboard update to specific user
const sendDashboardUpdateToUser = (userId, data) => {
  const io = global.io;
  if (!io) return;
  
  io.to(`user:${userId}`).emit('dashboard-update', data);
};

// Send dashboard update to users with specific role
const sendDashboardUpdateToRole = (role, data) => {
  const io = global.io;
  if (!io) return;
  
  io.to(`role:${role}`).emit('dashboard-update', data);
};

module.exports = {
  initializeSocketIO,
  sendNotificationToUser,
  sendNotificationToRole,
  sendNotificationToCooperative,
  sendDashboardUpdateToUser,
  sendDashboardUpdateToRole,
};
