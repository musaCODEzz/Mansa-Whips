import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mansawhips';

// Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});
app.use(cors());
app.use(express.json({ limit: '15mb' })); // support large base64 WebP uploads

// Routes
app.use('/api', apiRouter);

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Mansa Whips API is running smoothly.' });
});

// Database Connection and Server Startup
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Express server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
