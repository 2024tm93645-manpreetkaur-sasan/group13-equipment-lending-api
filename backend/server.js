const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/database');
const config = require('./config/config');
const routes = require('./routes');
//const startScheduler = require('./scripts/overdueScheduler');
const { StatusCodes } = require('http-status-codes');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// attach user from proxy headers
app.use((req, res, next) => {
  const uid = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];
  if (uid) req.user = { id: uid, role: role || 'student' };
  next();
});

app.use('/api', routes);

connectDB()
  .then(() => {
    app.listen(config.PORT, () => console.log('backend listening', config.PORT));
    //startScheduler();
  })
  .catch((e) => {
    console.error('DB connect error', e.message);
    process.exit(1);
  });
