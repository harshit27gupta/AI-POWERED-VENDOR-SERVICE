import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import geminiConnection from './config/gemini.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize Gemini AI
const model = geminiConnection.initialize();

app.get('/', (req, res) => {
  res.send('AI Service');
});

app.get('/health', (req, res) => {
  const geminiStatus = geminiConnection.getStatus();
  res.json({ 
    status: 'OK', 
    message: 'AI Service is running',
    timestamp: new Date().toISOString(),
    gemini: geminiStatus
  });
});

const PORT = process.env.AI_PORT || 3002;

app.listen(PORT, () => {
  console.log(`🤖 AI Service running on port ${PORT}`);
});

export default app; 