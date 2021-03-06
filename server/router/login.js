var express = require("express");
var router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const functionAutho = require("../public/javascripts/CheckAutho");
const login = require("../public/db/schema/User_Schema");
let user;
router.get("/", functionAutho.checkNotAuthenticated, (req, res) => {
  res.send("hello");
});

// router.post("/", passport.authenticate("local"), function (req, res) {
//   res.send({ id: user.ID});
// });


router.post("/", async (req, res) => {
  let userRequest = req.body;
  let DBfindUser = await login
    .find({ username: userRequest.username, password: userRequest.password })
    .lean()
    .exec();
  if (DBfindUser[0]) {
    user = {
      ID: DBfindUser[0]._id,
      username: DBfindUser[0].username,
      password: DBfindUser[0].password,
    };
    if (user && user.password == userRequest.password) {
      res.send({ id: user.ID , username: user.username });
    } else {
      res.send({ error: "Invalid password" });
    }
  } else {
    res.send({ error: "Username or password is not correct" });
  }
});

module.exports = router;
