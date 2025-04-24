const mongoose = require("mongoose");

const UseraccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // assuming you have a User model
  },
  upiId: {
    type: String,
  },
  accountHolderName: {
    type: String,
  },
  bankName: {
    type: String,
  },
  bankAccountNo: {
    type: String,
  },
  bankIfsc :{
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

module.exports = mongoose.model("Useraccount", UseraccountSchema);
