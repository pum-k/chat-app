const express = require("express");
const app = express();
const server = require("http").createServer(app);

const mongoose = require("mongoose");
const session = require("express-session");
const chatroom = require("./router/chatFunction");
const login = require("./router/login");
const register = require("./router/register");
const user = require("./router/user");
const friend = require("./router/friend");
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
app.use(
  session({
    secret: "zxzxczcasd",
    resave: false,
    saveUninitialized: true,
    cookie: { expires: 100000 * 60 },
  })
);


mongoose
  .connect("mongodb+srv://administrator:administrator@chatdb.oyaqd.mongodb.net/chatdb?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err));
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected successfully");
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('socketio', io);
app.use("/chat", chatroom);
app.use("/login", login);
app.use("/register", register);
app.use('/user' , user)

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
