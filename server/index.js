const express = require("express");
const app = express();
const server = require("http").createServer(app);
const connection = require("./public/db/configmongoose");
const mongoose = require("mongoose");
const session = require("express-session");
const chatroom_router = require("./router/chatFunction");
const login_router = require("./router/login");
const register_router = require("./router/register");
const user_router = require("./router/user");
const friend = require("./router/friend");
const photo_router = require("./router/photo");
var cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
app.use(
  session({
    secret: "zxzxczcasd",
    resave: false,
    saveUninitialized: true,
    cookie: { expires: 100000 * 60 },
  })
);
connection();

app.set("socketio", io);
app.use("/chat", chatroom_router);
app.use("/login", login_router);
app.use("/register", register_router);
app.use("/photo", photo_router);
app.use("/user", user_router);

let users = [];

app.set("users", users);
io.on("connection", function (socket) {
  socket.on("user_connection", (data) => {
    let index = users.findIndex((user) => user.idUser === data.id);
    if (index == -1) {
      users.push({
        socketId: socket.id,
        idUser: data.id,
        username: data.username,
        peerid: data.peerid,
      });
    } else {
      users[index].socketId = socket.id;
      users[index].peerid = data.peerid;
    }
  });
  socket.on("callToOrther", (UsersCall) => {
    
    let userInCurrentRoom = users.filter(
      (user) => user.currentRoom == UsersCall.currentRoom
    );
    let index = userInCurrentRoom.findIndex(
      (user) => user.idUser === UsersCall.ownerCall
    );
    io.to(users[index == 1 ? 0 : 1].socketId).emit("receiveCall" , UsersCall);
  });
  socket.on("join_room", (data) => {
    let index = users.findIndex((user) => user.idUser === data.userInfo);
    if (index == -1) {
      users.push({
        socketId: socket.id,
        idUser: data.userInfo,
        
        username: data.username,
        currentRoom: data.currentRoom,
        peerid: data.peerid,
      });
    } else {
      users[index].socketId = socket.id;
      users[index].displayName = data.displayname
      users[index].currentRoom = data.room_id;
      users[index].avatar=  data.avatar,
      users[index].peerid = data.peerid;
    }
    socket.join(data.room_id);
    console.log("A user has just joined the room: " + data.room_id);
  });
  socket.on("sendMessage", (message) => {
    io.to(message.room_id).emit("newMessages", message);
  });
  socket.on("disconnect", async () => {
    let index = await users.findIndex((user) => user.idUser === socket.idUser);
    await users[
      ({
        ...users.slice(0, index),
      },
      {
        ...users.slice(index + 1),
      })
    ];
  });
});

server.listen(4000, () =>
  console.log("Server is running at http://localhost:4000/")
);
