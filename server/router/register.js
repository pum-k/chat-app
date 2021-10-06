var express = require("express");
var router = express.Router();
const functionAutho = require("../public/javascripts/CheckAutho");
const login = require("../public/db/schema/User_Schema");
/* GET home page. */
router.get("/", functionAutho.checkNotAuthenticated, (req, res) => {
  console.log("register");
});

router.post("/", async (req, res) => {
  let User = new login(req.body);
  await User.save(function (err, result) {
    if (!err) {
      res.send({ isSuccess: true });
    } else {
      res.send({error: "dang ky that bai" , isSuccess: false });
    }
  });
});
module.exports = router;
