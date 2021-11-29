var express = require("express");
var router = express.Router();
var users = require("../public/db/schema/User_Schema");
var RoomChat = require("../public/db/schema/chatroom_Schema");
var upload = require("../public/db/functionForDB/upload");
var moment = require("moment");
let PORT = process.env.PORT || "http://localhost:4000";
router.post("/sendMessage", async (req, res) => {
  var io = req.app.get("socketio");
  let orther = "";
  let people = await users.findById({ _id: req.body.id });
  let newMessage = {
    message: req.body.line_text,
    displayName: people.displayName,
    user_name: people.username,
    create_at: people.createAt,
    user_Id: people._id,
  };
  let room = await RoomChat.find({ _id: req.body.room_id }).lean().exec();

  let testIndex = await room[0].MemberName.findIndex(
    (eachUser) => eachUser == req.body.id
  );
  orther = room[0].MemberName[testIndex == 1 ? 0 : 1];

  var userSocket = req.app.get("users");
  let index = userSocket.findIndex((user) => user.idUser == orther);
  if (userSocket[index] != undefined) {
    io.to(userSocket[index].socketId).emit("newMessageComming", {
      Room: req.body.room_id,
    });
  }
  io.to(req.body.room_id).emit("newMessages", newMessage);
  await RoomChat.findByIdAndUpdate(
    { _id: req.body.room_id },
    {
      $push: {
        textChat: {
          line_text: req.body.line_text,
          displayName: people.displayName,
          user_name: people.username,
          createAt: Date.now(),
          type: "text",
        },
      },
    }
  );
  res.send({ sendSuccess: true });
  // console.log(newMessage);
});
router.post("/sendImage", upload.single("file"), async (req, res) => {
  var io = req.app.get("socketio");
  let people = await users.findById({ _id: req.body.id });
  if (req.file === undefined) return res.send({ isSuccess: false });
  const imgUrl = `${PORT}/photo/${req.file.filename}`;
  let newMessage = {
    message: imgUrl,
    user_name: people.username,
    displayName: people.displayName,
    create_at: people.createAt,
    user_Id: people._id,
  };
  var userSocket = req.app.get("users");
  let index = userSocket.findIndex((user) => user.idUser == people._id);
  if (userSocket[index] != undefined) {
    io.to(userSocket[index].socketId).emit("newMessageComming", {
      Room: req.body.room_id,
    });
  }
  io.to(req.body.room_id).emit("newMessages", newMessage);
  await RoomChat.findByIdAndUpdate(
    { _id: req.body.room_id },
    {
      $push: {
        textChat: {
          line_text: imgUrl,
          displayName: people.displayName,
          user_name: people.username,
          createAt: Date.now(),
          type: "image",
        },
      },
    }
  );
  res.send({ sendSuccess: true });
  console.log(newMessage);
});
router.post("/listMessages", async (req, res) => {
  if (req.body.chatRoom) {
    let ListMessages = await RoomChat.find({ _id: req.body.chatRoom })
      .lean()
      .exec();
    // console.log(ListMessages);
    // let ortherUser = await
    if (ListMessages[0].textChat.length > 0) {
      res.send({
        ListMessages: ListMessages[0].textChat,
        isBlock: ListMessages[0].isBlock,
      });
    } else {
      res.send({ ListMessages: null });
    }
  }
});
router.post("/listChatPage", async (req, res) => {
  let user = req.body;
  let userRoomInUser = await users.find({ _id: user.owners }).lean().exec();
  let ListRoomChat = userRoomInUser[0].RoomChatId;
  let infoAllRoomChat = [];
  let ChatMessageFirstRoom = [];
  if (ListRoomChat.length > 0) {
    for (let i = 0; i < ListRoomChat.length; i++) {
      let eachRoomChat = await RoomChat.find({ _id: ListRoomChat[i] });
      let RoomName = [];
      let AlltextChat = eachRoomChat[0].textChat;
      // console.log();
      // let lastMessage =
      for (let j = 0; j < eachRoomChat[0].MemberName.length; j++) {
        if (eachRoomChat[0].MemberName[j] != user.owners) {
          let name = await users
            .findById({ _id: eachRoomChat[0].MemberName[j] })
            .lean()
            .exec();
          RoomName.push({
            username: name.username,
            displayName: name.displayName || name.username,
            avatar: name.avatar || "",
          });
        }
      }
      console.log(AlltextChat[AlltextChat.length - 1]);
      infoAllRoomChat.push({
        friend_name: RoomName[0].username,
        displayName: RoomName[0].displayName,
        avatar: RoomName[0].avatar,
        room_id: eachRoomChat[0]._id,
        isBlock: eachRoomChat[0].isBlock,
        time:
          AlltextChat[0] != undefined &&
          moment(AlltextChat[AlltextChat.length - 1].createAt).fromNow(),
        last_message:
          AlltextChat[0] != undefined
            ? AlltextChat[AlltextChat.length - 1].displayName +
                ": " +
                AlltextChat[AlltextChat.length - 1].line_text ||
              AlltextChat[0].user_name +
                ": " +
                AlltextChat[AlltextChat.length - 1].line_text
            : "",
      });

      RoomName = [];
    }
  }
  res.send({ infoAllRoomChat });
});

router.post("/blockRoom", async (req, res) => {
  let request = req.body;
  let room = await RoomChat.find({ _id: request.room_id }).lean().exec();

  var userSocket = req.app.get("users");

  let testIndex = await room[0].MemberName.findIndex(
    (eachUser) => eachUser == req.body.owners
  );
  orther = room[0].MemberName[testIndex == 1 ? 0 : 1];
  var io = req.app.get('socket')
  let index = userSocket.findIndex((user) => user.idUser == orther);
  if (userSocket[index] != undefined) {
    io.to(userSocket[index].socketId).emit("lock", {
      Room: req.body.room_id,
    });
  }



  if (room.length > 0) {
    await RoomChat.updateOne(
      { _id: request.room_id },
      { $set: { isBlock: true, id_user_block: request.owners } },
      (err) => {
        if (!err) {
          res.send({ isSuccess: true });
        }
      }
    );
  } else {
    res.send({ isSuccess: false });
  }
});
router.post("/unBlockRoom", async (req, res) => {
  let request = req.body;
 
  let room = await RoomChat.find({ _id: request.room_id }).lean().exec();
  var userSocket = req.app.get("users");

  let testIndex = await room[0].MemberName.findIndex(
    (eachUser) => eachUser == req.body.owners
  );
  orther = room[0].MemberName[testIndex == 1 ? 0 : 1];
  var io = req.app.get('socket')
  let index = userSocket.findIndex((user) => user.idUser == orther);
  if (userSocket[index] != undefined) {
    io.to(userSocket[index].socketId).emit("unBlock", {
      Room: req.body.room_id,
    });
  }
  
  if (room.length > 0) {
    if (room[0].id_user_block == request.owners) {
      await RoomChat.updateOne(
        { _id: request.room_id },
        { $set: { isBlock: false, id_user_block: null } },
        (err) => {
          if (!err) {
            res.send({ isSuccess: true });
          }
        }
      );
    } else {
      res.send({ isSuccess: false });
    }
  } else {
    res.send({ isSuccess: false });
  }
});

module.exports = router;
