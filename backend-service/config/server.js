import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

class ExpressServer {
  constructor() {
    this.app = null;
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) {
      console.log('✅ Express server already initialized');
      return this.app;
    }

    try {
      this.app = express();
      
      // Setup middleware
      this.setupMiddleware();
      
      // Setup basic routes
      this.setupBasicRoutes();
      
      this.isInitialized = true;
      console.log('✅ Express server initialized');

      return this.app;
    } catch (error) {
      console.error('❌ Express server initialization error:', error);
      process.exit(1);
    }
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupBasicRoutes() {
    this.app.get('/', (req, res) => {
      res.send('Hello World');
    });

    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'AI-Powered Hyperlocal Marketplace API is running',
        timestamp: new Date().toISOString()
      });
    });

    this.app.use('*', (req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });
  }

  getApp() {
    return this.app;
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized
    };
  }
}

// Create singleton instance
const expressServer = new ExpressServer();

export default expressServer; 