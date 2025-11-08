const express = require('express');
const connectDB = require('./config/database');
const config = require('./config/config');
const routes = require('./routes');
const injectUser = require('./common/injectUser');
const startOverdueScheduler = require('./scripts/overDueScheduler');
const logger = require('./utils/logger');

// New middlewares
const correlationId = require('./middleware/correlationId');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

console.log("🚀 Starting backend...");
console.log("✅ Loaded config:", config);

const app = express();

// Increase body limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Correlation ID + structured request logging
app.use(correlationId);
app.use(requestLogger);

// Optional: legacy console logging can be removed
app.use(injectUser);

// Route handling
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', correlationId: req.correlationId });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// Start server only after DB connects
connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      logger.info(` Backend listening at PORT: ${config.PORT}`);
      startOverdueScheduler();
      logger.info("Overdue Scheduler STARTED (CRON running)");
    });
  })
  .catch((e) => {
    logger.error({ message: e.message, stack: e.stack }, ' DB connection failed');
    process.exit(1);
  });
