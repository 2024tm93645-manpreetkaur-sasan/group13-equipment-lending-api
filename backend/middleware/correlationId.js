const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  const correlationId = req.get('X-Correlation-Id') || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-Id', correlationId);
  next();
};
