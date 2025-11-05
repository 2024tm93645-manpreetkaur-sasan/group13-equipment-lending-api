const r = require('express').Router();
const c = require('../controllers/equipmentController');

const requireRole = require('../common/roles');
r.get('/', c.list);

r.post('/', requireRole(['staff', 'admin']), c.create);
r.put('/:id', requireRole(['staff', 'admin']), c.update);
r.delete('/:id', requireRole(['staff', 'admin']), c.remove);

module.exports = r;
