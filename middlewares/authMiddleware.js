// middlewares/authMiddleware.js
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

function checkAdmin(req, res, next) {
  console.log(req.user.is_admin);
  if (req.user.is_admin === true) {
    return next();
  }
  res.redirect("/");
}

module.exports = { checkAuthenticated, checkNotAuthenticated, checkAdmin };
