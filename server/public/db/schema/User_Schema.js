const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    displayName: { type: String },
    avatar: { type: String },
    cover_image: { type: String },
    gender: { type: String },
    createAt: { type: Date, default: Date.now },
    requestAddFriends: [{ type: Schema.Types.ObjectId, ref: "user" }],
    peddingRequests: [{ type: Schema.Types.ObjectId, ref: "user" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
    RoomChatId: [{ type: Schema.Types.ObjectId, ref: "chatroom" }],
  },
  { collection: "users" }
);

module.exports = mongoose.model("users", User);
