var express = require("express");
var router = express.Router();
const functionAutho = require("../public/javascripts/CheckAutho");
const user = require("../public/db/schema/User_Schema");
/* GET home page. */
router.get("/", functionAutho.checkNotAuthenticated, (req, res) => {
  console.log("Register");
});

router.post("/", async (req, res) => {
  let InfoUser = req.body;
  let checkUser = await user
    .find({ username: InfoUser.username })
    .lean()
    .exec();
  let checkPhoneNumber = await user.find({phoneNumber:InfoUser.phoneNumber}).lean().exec();

  if (checkUser.length == 0) {
    if(checkPhoneNumber.length ==0 ){
      let User = new user({...req.body , gender: 'male'});
      await User.save(function (err, result) {
        if (!err) {
          res.send({ isSuccess: true });
        } else {
          res.send({ error: "Register fail", isSuccess: false });
        }
      });
    }
    else{
      res.send({error: "Phone number is existed"})
    }


  } else {
    res.send({ error: "Username is existed" });
  }
});
module.exports = router;
