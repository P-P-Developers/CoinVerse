const mongoose = require("mongoose");

const PaymenetHistory = new mongoose.Schema(
  {
    adminid: {
      type: String,
      default: null,
    },
    userid: {
      type: String,
      default: null,
      index: true,
    },
    Balance: {
        type: Number,
        required: true
    },
    type: {
        type: Number
    },
    status: {
      type: Number,
      enum: [0,1,2],
      default: 0,
    },
    message:{
      type: String,
      default: null,
    },
    notification_title: {
      type: String,
      default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    ScreenShot: {
      type: String,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PaymenetHistorySchema = mongoose.model(
  "UserWithdrawalHistory",
  PaymenetHistory
);

module.exports = PaymenetHistorySchema;
