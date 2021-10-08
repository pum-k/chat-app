var express = require("express");
var router = express.Router();
var user = require("../public/db/schema/User_Schema");
router.post("/addfriend", async (req, res) => {
  let newFriendAdd = req.body;
  let findFriend = await user
    .find({ username: newFriendAdd.username })
    .lean()
    .exec();
  if (findFriend) {
    await user.findByIdAndUpdate(
      { _id: newFriendAdd.owners },
      { $push: { friends: findFriend._id } }
    );
  } else {
    res.send({ error: "khong tim thay voi username nay" });
  }
});
module.exports = router;
