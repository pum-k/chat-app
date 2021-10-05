var express = require('express');
var router = express.Router();


router.post("/sendMessage", (req, res) => {
  var io = req.app.get('socketio');
  io.to(req.body.room_id).emit("newMessages", req.body);
});

module.exports = router;
