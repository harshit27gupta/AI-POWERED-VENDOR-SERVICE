import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();
class SocketConnection {
  constructor() {
    this.io = null;
    this.isInitialized = false;
  }

  initialize(server) {
    if (this.isInitialized) {
      console.log('✅ Socket.io already initialized');
      return this.io;
    }

    try {
      this.io = new Server(server, {
        cors: {
          origin: process.env.FRONTEND_URL || "http://localhost:5173",
          methods: ["GET", "POST"]
        }
      });

      this.isInitialized = true;
      console.log('✅ Socket.io initialized');

      this.setupBasicHandlers();

      return this.io;
    } catch (error) {
      console.error('❌ Socket.io initialization error:', error);
      process.exit(1);
    }
  }

  setupBasicHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });

      socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
      });

      socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room: ${roomId}`);
      });
    });
  }

  getIO() {
    return this.io;
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      connectedClients: this.io ? this.io.engine.clientsCount : 0
    };
  }
}

const socketConnection = new SocketConnection();

export default socketConnection; 