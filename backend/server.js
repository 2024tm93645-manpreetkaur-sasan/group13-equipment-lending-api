const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/database');
const config = require('./config/config');
const routes = require('./routes');
const injectUser = require('./common/injectUser');

console.log("➡️ Starting backend...");
console.log("🔧 Loaded config:", config);

const app = express();

// Increase body limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use(morgan('dev'));

// Inject user middleware
app.use(injectUser);

app.use((req, res, next) => {
  console.log('🔥 Backend received request:');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Headers:', req.headers);
  next();
});


// API routes
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(config.PORT, () => console.log('Backend listening at PORT', config.PORT));
  })
  .catch((e) => {
    console.error('DB connect error', e.message);
    process.exit(1);
  });
