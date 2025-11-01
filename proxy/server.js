import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import apiProxy from './middleware/apiProxy.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;
const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000';

// DB connection
connectDB();

// Core middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);

// Proxy middleware
app.use('/api', apiProxy);

app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT} → ${BACKEND}`));
