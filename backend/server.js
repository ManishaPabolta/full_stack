import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/auth.js';
import path from 'path';

dotenv.config(); 

const app = express();


connectDB().catch((err) => {
  console.warn('MongoDB connection failed (continuing without DB):', err.message || err);
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);

// Serve uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});


app.use(errorHandler);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
