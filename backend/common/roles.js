const { StatusCodes } = require('http-status-codes');
module.exports = function (role) {
  return function (req, res, next) {
    const u = req.user;
    if (!u) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'unauthorized' });
    if (u.role !== role) return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'forbidden' });
    next();
  };
};
