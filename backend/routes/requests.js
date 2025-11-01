const r = require('express').Router();
const c = require('../controllers/requestController');
const requireRole = require('../common/roles');
r.post('/', c.request);
r.get('/', c.list);
r.post('/:id/approve', requireRole('staff'), c.approve);
r.post('/:id/issue', requireRole('staff'), c.issue);
r.post('/:id/return', requireRole('staff'), c.return);
module.exports = r;
