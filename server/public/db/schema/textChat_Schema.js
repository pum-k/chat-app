const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatMessage = new Schema({
  roomOwnerID: { type: String, required: true },
  line_text: string,
  userId: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

// const DonHang = ;
module.exports = mongoose.model("ChatMessage", ChatMessage);
