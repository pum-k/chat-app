var express = require("express");
var router = express.Router();

router.post("/sendMessage", (req, res) => {
  var io = req.app.get("socketio");
  console.log(req.body);
  io.to(req.body.room_id).emit("newMessages", req.body.line_text)
  // console.log(req.body);
  res.send({ sendSuccess: true });
});

module.exports = router;
