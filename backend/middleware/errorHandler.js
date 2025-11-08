const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const correlationId = req.correlationId;

  logger.error({
    correlationId,
    method: req.method,
    path: req.originalUrl,
    status,
    code,
    message: err.message,
    stack: err.stack
  }, 'Error occurred');

  res.status(status).json({
    error: {
      message: err.message,
      code,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      correlationId
    }
  });
};
