const r = require('express').Router();
const c = require('../controllers/notificationController');
r.get('/', c.list);
module.exports = r;
