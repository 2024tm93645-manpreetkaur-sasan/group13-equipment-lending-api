const r = require('express').Router();
const c = require('../controllers/equipmentController');

const requireRole = require('../common/roles');
r.get('/', c.list);

r.post('/', requireRole('admin'), c.create);
r.put('/:id', requireRole('admin'), c.update);
r.delete('/:id', requireRole('admin'), c.remove);

module.exports = r;
