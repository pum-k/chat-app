const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
	  email: {type: String},
    displayName: { type: String },
    avatar: { type: String},
    createAt: { type: Date, default: Date.now },
    RoomChatId : [{ type: Schema.Types.ObjectId, ref: "Project"}]
  },
  { collection: "User" }
);

// const DonHang = ;
module.exports = mongoose.model("User", User);
