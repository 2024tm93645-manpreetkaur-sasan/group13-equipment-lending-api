module.exports = function (req, res, next) {
  const id = req.headers["x-user-id"];
  const role = req.headers["x-user-role"];

  if (id && role) {
    req.user = { id, role };
    console.log("User Injected into backend:", req.user);
  } else {
    console.log("No user info found in request headers");
  }

  next();
};
