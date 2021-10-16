var express = require("express");
var router = express.Router();
var users = require("../public/db/schema/User_Schema");
var RoomChat = require("../public/db/schema/chatroom_Schema");
var textChat = require("../public/db/schema/textchat_Schema");
router.post("/sendMessage", async (req, res) => {
  var io = req.app.get("socketio");
  let people = await users.findById({ _id: req.body.id });
  let newMessage = {
    message: req.body.line_text,
    user_name: people.username,
    create_at: people.createAt,
  };
  io.to(req.body.room_id).emit("newMessages", newMessage);
  await RoomChat.findByIdAndUpdate(
    { _id: req.body.room_id },
    {
      $push: {
        textChat: {
          line_text: req.body.line_text,
          userName: req.body.id,
          createAt: Date.now(),
        },
      },
    }
  );
  res.send({ sendSuccess: true });
});
router.post('/listMessages', async (req, res) => {

})
router.post('/listMessages', async (req, res) => {

})
router.post("/listChatPage", async (req, res) => {
  let user = req.body;
  let userRoomInUser = await users.find({ _id: user.owners }).lean().exec();
  let ListRoomChat = userRoomInUser[0].RoomChatId;
  let infoAllRoomChat = [];
  for (let i = 0; i < ListRoomChat.length; i++) {
    let eachRoomChat = await RoomChat.find({ _id: ListRoomChat[i] });
    let RoomName = "";
    for (let j = 0; j < eachRoomChat[0].MemberName.length; j++) {
      if (eachRoomChat[0].MemberName[j] != user.owners) {
        let name = await users
          .findById({ _id: eachRoomChat[0].MemberName[j] })
          .lean()
          .exec();
        RoomName += name.username;
        name.username = "";
      }
    }
    infoAllRoomChat.push({
      RoomName: RoomName,
      RoomSocketId: eachRoomChat[0].SocketId,
      createAt: eachRoomChat[0].createAt,
    });
  }
  res.send(infoAllRoomChat);
});
module.exports = router;
