const mongoose = require("mongoose");

const UpiDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // assuming you have a User model
  },
  walleturl: {
    type: String,
  },

  qrCodeBase64: {
    type: String, // base64 string
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UpiDetails", UpiDetailsSchema);
