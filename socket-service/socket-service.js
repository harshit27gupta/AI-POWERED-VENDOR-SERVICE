import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import socketConnection from './config/socket.js';
dotenv.config();
const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());
connectDB();
const io = socketConnection.initialize(server);
app.get('/', (req, res) => {
  res.send('Socket Service');
});
app.get('/health', (req, res) => {
  const socketStatus = socketConnection.getStatus();
  res.json({ 
    status: 'OK', 
    message: 'Socket.io Service is running',
    timestamp: new Date().toISOString(),
    socket: socketStatus
  });
});
const PORT = process.env.SOCKET_PORT;
server.listen(PORT, () => {
  console.log(`🔌 Socket.io Service running on port ${PORT}`);
});
export default { app, server, io };   