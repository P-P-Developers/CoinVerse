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
    notification_title: {
      type: String,
      default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now
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
