const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    RoomName: {type: String , required: true},
    SocketId: {type: String, require: true},
    MemberName: [{ type: Schema.Types.ObjectId, ref: "User"}]
  },
);

// const DonHang = ;
module.exports = mongoose.model("User", User);
