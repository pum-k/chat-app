var express = require("express");
var router = express.Router();
var user = require("../public/db/schema/User_Schema");
var RoomChat = require("../public/db/schema/chatroom_Schema");
const upload = require("../public/db/functionForDB/upload");
const { v4: uuidv4 } = require("uuid");
let PORT = process.env.PORT || "http://localhost:4000";
const moment = require("moment");

router.post("/acceptAddFriend", async (req, res) => {
  let newFriendAdd = req.body;
  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
  // console.log(findFriend);
  if (findFriend.length > 0) {
    await user.updateOne(
      { _id: newFriendAdd.owners },
      { $push: { friends: findFriend[0]._id } }
    );

    await user.updateOne(
      { _id: newFriendAdd.owners },
      { $pull: { peddingRequests: findFriend[0]._id } }
    );

    //////
    await user.updateOne(
      { _id: findFriend[0]._id },
      { $push: { friends: newFriendAdd.owners } }
    );

    await user.updateOne(
      { _id: findFriend[0]._id },
      { $pull: { requestAddFriends: newFriendAdd.owners } }
    );

    let newRoom = new RoomChat({
      RoomName: "room vua ket ban",
      SocketId: uuidv4(),
    });
    // tao phong khi 2 nguoi ban
    await newRoom.save(async (err) => {
      if (err) {
        console.log(err);
      } else {
        await user.updateOne(
          { _id: newFriendAdd.owners },
          { $push: { RoomChatId: newRoom._id } }
        );
        await user.updateOne(
          { _id: findFriend[0]._id },
          { $push: { RoomChatId: newRoom._id } }
        );
        await RoomChat.updateOne(
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
router.post("/allRequestAddFriend", async (req, res) => {
  let request = req.body;
  let RequestAddFriend = [];
  let findInfo = await user.find({ _id: request.owners }).lean().exec();
  if (findInfo.length > 0) {
    let AllRequest = findInfo[0].requestAddFriends;
    if (AllRequest)
      for (let i = 0; i < AllRequest.length; i++) {
        let eachUser = await user.find({ _id: AllRequest[i] }).lean().exec();
        RequestAddFriend.push({
          username: eachUser[0].username,
          displayName: eachUser[0].displayName,
          avatar: eachUser[0].avatar,
          phoneNumber: eachUser[0].phoneNumber,
        });
      }
    res.send(RequestAddFriend);
  } else {
    res.send({ isSuccess: false });
  }
});
router.post("/denyAcceptAddFriend", async (req, res) => {
  let newFriendAdd = req.body;
  console.log(newFriendAdd);
  let findFriend = await user
    .find({ phoneNumber: newFriendAdd.phoneNumber })
    .lean()
    .exec();
  console.log(findFriend);
  if (findFriend.length > 0) {
    await user.updateOne(
      { _id: findFriend[0]._id },
      { $pull: { peddingRequests: newFriendAdd.owners } }
    );
    await user.updateOne(
      { _id: newFriendAdd.owners },
      { $pull: { requestAddFriends: findFriend[0]._id } }
    );
  }
  res.send({ isSuccess: true });
});
// router.post("/acceptAddFriend", async (req, res) => {
//   let request = req.body;
//   let findInfo = user.find({
//     _id: request.owners,
//     requestAddFriends: request.AcceptTo,
//   });
//   console.log(findInfo);
//   // await user.updateOne(
//   //   { _id: request.owners },
//   //   { $pull: { requestAddFriends: request.AcceptTo } }
//   // );
//   // await user.updateOne(
//   //   { _id: AcceptTo.AcceptTo },
//   //   { $pull: { peddingRequest: request.owners } }
//   // );
// });

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
  console.log(request.file);
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
router.post("/sendRequest", async (req, res) => {
  let request = req.body;
  let findFriend = await user
    .find({ phoneNumber: request.sendTo })
    .lean()
    .exec();
  console.log(findFriend);
  if (findFriend) {
    await user.updateOne(
      { _id: findFriend[0]._id },
      { $push: { requestAddFriends: request.owners } }
    );
    await user.updateOne(
      { _id: request.owners },
      { $push: { peddingRequests: findFriend[0]._id } }
    );
  }
  res.send({ isSuccess: true });
});

router.post("/listFriend", async (req, res) => {
  let request = req.body;
  let infoUser = await user.find({ _id: request.owners });
  let friends = [];
  if (infoUser.length > 0) {
    for (var i = 0; i < infoUser[0].friends.length; i++) {
      var eachfriend = infoUser[0].friends[i];
      let infoOfEachFriend = await user.find({ _id: eachfriend }).lean().exec();
      friends.push({
        _id: infoOfEachFriend[0]._id,
        phoneNumber: infoOfEachFriend[0].phoneNumber,
        avatar: infoOfEachFriend[0].avatar || '', 
        displayName: infoOfEachFriend[0].displayName || infoOfEachFriend[0].username,
      });
    }
  }
  if (friends.length > 0) {
    res.send(friends);
  } else {
    res.send({ isSuccess: false });
  }
});



module.exports = router;
