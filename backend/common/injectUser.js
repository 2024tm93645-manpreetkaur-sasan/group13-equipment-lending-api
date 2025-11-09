module.exports = function (req, res, next) {
  const id = req.headers["x-user-id"];
  const role = req.headers["x-user-role"];
  const name = req.headers["x-user-name"];

  if (id && role && name) {
    req.user = { id, role, name };
    console.log("User Injected into backend:", req.user);
  } else {
    console.log("No user info found in request headers");
  }

  next();
};
