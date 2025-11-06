const { StatusCodes } = require('http-status-codes');

module.exports = function (roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  console.debug("Roles required:", allowedRoles);

  return function (req, res, next) {
    const u = req.user;

    if (!u) {
      console.log("No user found in request");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'unauthorized' });
    }

    console.debug("User role found:", u.role);

    if (!allowedRoles.includes(u.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: 'forbidden' });
    }

    next();
  };
};
