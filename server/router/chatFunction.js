var express = require("express");
var router = express.Router();

router.post("/sendMessage", (req, res) => {
  var io = req.app.get("socketio");
  console.log('heelo');
  // io.to(req.body.room_id).emit("newMessages", req.body);
  console.log(req.body);
  res.send({ sendSuccess: true });
});

module.exports = router;
