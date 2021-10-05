const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { uuid } = require('uuidv4');
const chatroom = require("./router/chatFunction")
var cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
console.log(uuid());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/chatroom',chatroom)

io.on("connection", function (socket) {
  console.log('1 nguoi vua connect');
  socket.on("join_room", (data) => {
    socket.join(data.room_id);
    console.log('1 nguoi vua join vao room ' + data.room_id);
  });
  socket.on("sendMessage", (message) => {

    io.to(message.room_id).emit("newMessages", message);
  });
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});
app.set('socketio', io);


server.listen(4000, () => console.log("server is running at port 4000"));
