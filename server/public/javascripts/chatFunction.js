const express = require("express");
const router = express.Router();

module.exports = function (io) {
  const users = [];
  io.on("connection", (socket) => {
    socket.on("create_room", (data, UserRoom) => {
      socket.idUser = data.UserRoom;
      socket.room_id = data.RoomId;

      users.push({ Room: data.RoomId, Data: "Host", idUser: data.UserRoom });
      socket.join(data.RoomId);
    });

    socket.on("join_room", (data) => {
      socket.join(data.room_id);
      socket.idUser = data.ownerId;
      socket.room_id = data.room_id;
      users.push({
        RoomJoin: data.room_id,
        user: data.userInfo,
        idUser: data.ownerId,
      });
      io.to(data.room_id).emit("SomeOneJoin", users);
      io.to(data.room_id).emit("newUserJoin", {
        RoomJoin: data.room_id,
        message: data.userInfo + " Vừa Join vào room",
        userName: data.userInfo,
        idUser: data.ownerId,
      });
    });

    socket.on("sendMessage", (message) => {
      console.log(message + socket.room_id);

      io.to(socket.room_id).emit("newMessages", message);
    });

    socket.on("disconnect", () => {
      console.log(users);
      console.log("nguoi dung " + socket.idUser + " da thoat");
      let index = users.findIndex((user) => user.idUser === socket.idUser);
      users.splice(index, 1);
      let infoSomeOneDisconnect = socket.idUser;
      io.to(socket.room_id).emit("someOneDisconnect", users);
    });
  });
};
