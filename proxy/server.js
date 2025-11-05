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
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000'; // React app
const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000';

//  CORS only on Proxy (frontend → proxy)
app.use(
  cors({
    origin: FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role'],
  })
);

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);

// Proxy middleware (proxy → backend)
app.use('/api', apiProxy);

connectDB();

app.listen(PORT, () =>
  console.log(` Proxy running on port ${PORT} → Backend: ${BACKEND}`)
);
