var express = require('express');
var router = express.Router();
var user = require('../public/db/schema/User_Schema');
var RoomChat = require('../public/db/schema/chatroom_Schema');
const { v4: uuidv4 } = require('uuid');
router.post('/addfriend', async (req, res) => {
  let newFriendAdd = req.body;
  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
  if (findFriend) {
    await user.findByIdAndUpdate(
      { _id: newFriendAdd.owners },
      { $push: { friends: findFriend[0]._id } }
    );
    await user.findByIdAndUpdate(
      { _id: findFriend[0]._id },
      { $push: { friends: newFriendAdd.owners } }
    );
    let newRoom = new RoomChat({
      RoomName: 'room vua ket ban',
      SocketId: uuidv4(),
    });
    await newRoom.save(async (err) => {
      if (err) {
        console.log(err);
      } else {
        await user.findByIdAndUpdate(
          { _id: newFriendAdd.owners },
          { $push: { RoomChatId: newRoom._id } }
        );
        await user.findByIdAndUpdate(
          { _id: findFriend[0]._id },
          { $push: { RoomChatId: newRoom._id } }
        );
        await RoomChat.findByIdAndUpdate(
          { _id: newRoom._id },
          {
            $push: {
              MemberName: { $each: [findFriend[0]._id, newFriendAdd.owners] },
            },
          }
        );
      }
    });

    res.send('tao room thnah cong');
  } else {
    res.send({ error: 'khong tim thay voi username nay' });
  }
});
router.post('/findFriend', async (req, res) => {
  let newFriendAdd = req.body;

  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
  res.send(findFriend);
});
router.post('/getInfoUser', async (req, res) => {
  let request = req.body;
  let UserInfo = await user.find({ _id: request.owners }).lean().exec();
  res.send(UserInfo);
});
router.post('/editUserInfo', async (req, res) => {
  let request = req.body;
  let infoUser = await user.findById({ _id: request.owners }).lean().exec();
  let edit_User = {
    dateOfBirth: request.dateOfBirth || infoUser.dateOfBirth,
    displayName: request.displayName || infoUser.displayName,
    gender: request.gender,
  };
  await user.updateOne(
    { _id: request.owners },
    {
      $set: {
        dateOfBirth: edit_User.dateOfBirth,
        displayName: edit_User.displayName,
        gender: edit_User.gender,
      },
    },
    { new: true },
    (err) => {
      if (err) {
        res.send({ success: false });
      } else {
        res.send({ success: true });
      }
    }
  );
});
module.exports = router;
