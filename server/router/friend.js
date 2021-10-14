var express = require("express");
var router = express.Router();
router.post("/findFriend",async (req, res) => {
  let newFriendAdd = req.body;
  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
    res.send(findFriend);
})
router.post("/addFriend", async (req, res) => {
  let newFriendAdd = req.body;
  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
  if (findFriend) {
    await User.findByIdAndUpdate(
      { _id: newFriendAdd.owners },
      { $push: { friends: findFriend._id } }
    );
  }
  else{
      res.send({error: "khong tim thay voi username nay"})
  }
});
module.exports = router