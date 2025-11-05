import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiProxy, injectUserMiddleware, rawBodyMiddleware } from './middleware/apiProxy.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: FRONTEND,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role'],
}));

app.use(morgan('dev'));

// Use rawBody middleware BEFORE json middleware
app.use(rawBodyMiddleware);

// Use JWT → req.user
app.use(injectUserMiddleware);

// Mount proxy
app.use('/api', apiProxy);

app.listen(PORT, () => console.log(`Proxy running on port ${PORT} → Backend: ${process.env.BACKEND_URL}`));
