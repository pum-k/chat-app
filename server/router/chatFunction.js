var express = require("express");
var router = express.Router();
const user = require("../public/db/schema/User_Schema");
router.post("/sendMessage", async (req, res) => {
  var io = req.app.get("socketio");
  let people = await user.findById({_id : req.body.id})
  let newMessage = {
    message: req.body.line_text,
    user_name: people.username, 
    create_at: people.createAt
  }
  io.to(req.body.room_id).emit("newMessages", newMessage)
  // console.log(req.body);
  res.send({ sendSuccess: true });
});

module.exports = router;
