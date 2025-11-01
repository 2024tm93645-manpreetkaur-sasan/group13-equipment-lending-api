require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || '*/1 * * * *',
};
