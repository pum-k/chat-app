function checkAuthentica(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Authenticated!");
    return next();
  } else {
    console.log("Unauthenticated!");
    res.send({ redirect: "/login" });
  }
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.send({ redirect: "/home" });
  }
}

module.exports = {
  checkAuthentica,
  checkNotAuthenticated,
};
