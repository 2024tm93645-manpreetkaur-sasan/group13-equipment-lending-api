const r = require('express').Router();
r.use('/equipments', require('./equipment'));
r.use('/requests', require('./requests'));
r.use('/notifications', require('./notification'));
module.exports = r;
