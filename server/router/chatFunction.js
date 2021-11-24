var express = require("express");
var router = express.Router();
var users = require("../public/db/schema/User_Schema");
var RoomChat = require("../public/db/schema/chatroom_Schema");

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
      let AlltextChat = eachRoomChat[0].textChat
      // console.log();
    
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
        last_message: AlltextChat[0] != undefined ? AlltextChat[0].line_text : "",
      });
      RoomName=[]
    }
  }
  res.send({ infoAllRoomChat });
});
module.exports = router;
