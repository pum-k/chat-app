var express = require("express");
var router = express.Router();
var users = require("../public/db/schema/User_Schema");
var RoomChat = require("../public/db/schema/chatroom_Schema");
var upload = require("../public/db/functionForDB/upload")
var moment = require("moment")
let PORT = process.env.PORT || "http://localhost:4000";
router.post("/sendMessage", async (req, res) => {
  var io = req.app.get("socketio");
  console.log(req.body);
  let people = await users.findById({ _id: req.body.id });
  let newMessage = {
    message: req.body.line_text,
    user_name: people.username,
    create_at: people.createAt,
    user_Id: people._id,
  };
  io.to(req.body.room_id).emit("newMessages", newMessage);
  await RoomChat.findByIdAndUpdate(
    { _id: req.body.room_id },
    {
      $push: {
        textChat: {
          line_text: req.body.line_text,
          user_name: people.username,
          createAt: Date.now(),
          type: "text"
        },
      },
    }
  );
  res.send({ sendSuccess: true });
  console.log(newMessage);
}); 
router.post("/sendImage", upload.single("file") , async (req, res) => {
  var io = req.app.get("socketio");
  let people = await users.findById({ _id: req.body.id });
  if (req.file === undefined) return res.send({isSuccess: false});
  const imgUrl = `${PORT}/photo/${req.file.filename}`;
  let newMessage = {
    message: imgUrl,
    user_name: people.username,
    create_at: people.createAt,
    user_Id: people._id,
  };
  io.to(req.body.room_id).emit("newMessages", newMessage);
  await RoomChat.findByIdAndUpdate(
    { _id: req.body.room_id },
    {
      $push: {
        textChat: {
          line_text: imgUrl,
          user_name: people.username,
          createAt: Date.now(),
          type: "image"
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
      res.send({ ListMessages: ListMessages[0].textChat });
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
            displayName: name.displayName || name.username ,
            avatar: name.avatar || "",
          });
          // name.username = "";
        }
      }
      infoAllRoomChat.push({
        friend_name: RoomName[0].username,
        displayName : RoomName[0].displayName,
        avatar: RoomName[0].avatar,
        room_id: eachRoomChat[0]._id,
        time: moment(AlltextChat[AlltextChat.length - 1].createAt).fromNow(),
        last_message:  AlltextChat[0] != undefined ? RoomName[0].displayName +': ' + AlltextChat[AlltextChat.length - 1].line_text  : ""
      });
      RoomName=[]
    }
  }
  res.send({ infoAllRoomChat });
});
module.exports = router;

