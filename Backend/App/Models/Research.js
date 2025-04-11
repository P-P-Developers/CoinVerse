const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  researchType: {
    type: String,
    enum: ["Crypto", "Forex"],
    required: true,
  },
  coin: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  stopLoss: {
    type: Number,
    required: true,
  },
  entryReason: {
    type: String,
    default: "",
  },
  note: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Open", "Close"],
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Research", researchSchema);
