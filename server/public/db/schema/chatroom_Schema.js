const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatroom = new Schema(
  {
    RoomName: { type: String, required: true },
    MemberName: [{ type: Schema.Types.ObjectId, ref: "users" }],
    isBlock: { type: Boolean },
    id_user_block: { type: Schema.Types.ObjectId, ref: "users" },
    textChat: [
      {
        line_text: { type: String, required: true },
        user_name: { type: String, required: true },
        createAt: { type: Date, default: Date.now },
        type: { type: String },
      },
    ],
  },
  { collection: "chatroom" }
);

// const DonHang = ;
module.exports = mongoose.model("chatroom", chatroom);
