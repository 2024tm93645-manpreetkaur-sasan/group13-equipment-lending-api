const pino = require('pino');

const logger = pino({
  base: { service: 'equipment-lending-backend' },
  timestamp: pino.stdTimeFunctions.isoTime
});

module.exports = logger;
