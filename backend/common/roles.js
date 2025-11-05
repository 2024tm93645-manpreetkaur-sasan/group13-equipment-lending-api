const { StatusCodes } = require('http-status-codes');

module.exports = function (roles) {
  // Ensure roles is always an array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  console.log("Roles required:", allowedRoles);

  return function (req, res, next) {
    const u = req.user;

    if (!u) {
      console.log("No user found in request");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'unauthorized' });
    }

    console.log("User role found:", u.role);

    if (!allowedRoles.includes(u.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: 'forbidden' });
    }

    next();
  };
};
