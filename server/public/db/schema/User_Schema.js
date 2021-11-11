const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
	  phoneNumber: {type: String},
    dateOfBirth: {type: String},
    displayName: { type: String },
    avatar: { type: String},
    createAt: { type: Date, default: Date.now },
    friends: [{ type: Schema.Types.ObjectId, ref: "user"}],
    RoomChatId : [{ type: Schema.Types.ObjectId, ref: "chatroom"}]
  },
  { collection: "users" }
);

// const DonHang = ;
module.exports = mongoose.model("users", User);
