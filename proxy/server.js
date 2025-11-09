import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import { apiProxy, injectUserMiddleware, rawBodyMiddleware } from './middleware/apiProxy.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';


//CORS proper handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND);
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header( "Access-Control-Allow-Headers","Authorization, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Preflight request handling
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});




app.use(morgan('dev'));

app.use('/auth', express.json(), authRoutes);

// Use rawBody middleware BEFORE json middleware
app.use(rawBodyMiddleware);

// Use JWT → req.user
app.use(injectUserMiddleware);

// Mount proxy
app.use('/api', apiProxy);

connectDB();

app.listen(PORT, () => console.log(`Proxy running on port ${PORT} → Backend: ${process.env.BACKEND_URL}`));
