var express = require("express");
var router = express.Router();
var user = require("../public/db/schema/User_Schema");
router.post("/addfriend", async (req, res) => {
  let newFriendAdd = req.body;
  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
  if (findFriend) {
   let addfriend =  await user.findByIdAndUpdate(
      { _id: newFriendAdd.owners },
      { $push: { friends: findFriend[0]._id } }
    );
    res.send(addfriend)
  } else {
    res.send({ error: "khong tim thay voi username nay" });
  }
});
router.post("/findFriend", async (req, res) => {
  let newFriendAdd = req.body;
  console.log('find friend');
  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
  res.send(findFriend);
});
module.exports = router;
