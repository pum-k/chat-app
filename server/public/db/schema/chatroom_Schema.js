const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatroom = new Schema(
  {
    RoomName: {type: String , required: true},
    SocketId: {type: String, require: true},
    MemberName: [{ type: Schema.Types.ObjectId, ref: "users"}],
    textChat: [{
      line_text: { type: String, required: true },
      Iduser: { type: String, required: true , ref: "users"},
      createAt: { type: Date, default: Date.now },
    }]
  },
  { collection: "chatroom" }
);

// const DonHang = ;
module.exports = mongoose.model("chatroom", chatroom);
