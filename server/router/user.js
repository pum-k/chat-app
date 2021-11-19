var express = require("express");
var router = express.Router();
var user = require("../public/db/schema/User_Schema");
var RoomChat = require("../public/db/schema/chatroom_Schema");
const upload = require("../public/db/functionForDB/upload");
const { v4: uuidv4 } = require("uuid");
let PORT = process.env.PORT || "http://localhost:4000";
const moment = require("moment");

router.post("/addfriend", async (req, res) => {
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
      RoomName: "room vua ket ban",
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

    res.send("tao room thnah cong");
  } else {
    res.send({ error: "khong tim thay voi username nay" });
  }
});
router.post("/findFriend", async (req, res) => {
  let newFriendAdd = req.body;

  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
  res.send(findFriend);
});
router.post("/getInfoUser", async (req, res) => {
  let request = req.body;
  let UserInfo = await user.find({ _id: request.owners }).lean().exec();
  res.send(UserInfo);
});
router.post("/editUserInfo", async (req, res) => {
  let request = req.body;

  let infoUser = await user.findById({ _id: request.owners }).lean().exec();

  if (infoUser) {
    let edit_User = await {
      id: infoUser._id,
      dateOfBirth: request.dateOfBirth || infoUser.dateOfBirth || null,
      displayName: request.displayName || infoUser.displayName || "",
      gender: request.gender,
    };
    try {
      await user.updateOne(
        { _id: edit_User.id },
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
            res.send({ error: err });
          } else {
            res.send({ success: true, data: edit_User });
          }
        }
      );
    } catch (e) {}
  }
});

router.post("/setAvater", upload.single("file"), async (req, res) => {
  let request = req.body;
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `${PORT}/photo/${req.file.filename}`;
  let userInfo = await user.find({ _id: request.owners }).lean().exec();
  try {
    await user.updateOne(
      { _id: userInfo[0]._id },
      {
        $set: {
          avatar: imgUrl,
        },
      },
      (err) => {
        if (!err) {
          res.send({ isSuccess: true });
        }
      }
    );
  } catch (e) {}
});
router.post("/setCoverImage", upload.single("file"), async (req, res) => {
  let request = req.body;
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `${PORT}/photo/${req.file.filename}`;
  let userInfo = await user.find({ _id: request.owners }).lean().exec();
  try {
    await user.updateOne(
      { _id: userInfo[0]._id },
      {
        $set: {
          cover_image: imgUrl,
        },
      },
      (err) => {
        if (!err) {
          res.send({ isSuccess: true });
        }
      }
    );
  } catch (e) {}
});

module.exports = router;
