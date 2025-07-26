import dotenv from 'dotenv';
import connectDB from './config/database.js';
import expressServer from './config/server.js';
dotenv.config();
connectDB();
const app = expressServer.initialize();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app; 