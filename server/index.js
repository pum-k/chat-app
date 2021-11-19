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

io.on("connection", function (socket) {
  socket.on("join_room", (data) => {
    socket.join(data.room_id);
    console.log("1 nguoi vua join vao room " + data.room_id);
  });
  socket.on("sendMessage", (message) => {
    io.to(message.room_id).emit("newMessages", message);
  });
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

server.listen(4000, () => console.log("Server is running at port 4000"));
