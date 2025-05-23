
const mongoose = require("mongoose");

const FieldChangeSchema = new mongoose.Schema({
  field: String,
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,

}, { _id: false });

const AdminActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  changes: [FieldChangeSchema],
  message: String, // human-readable summary
  action: { type: String, default: "Update Admin" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminActivityLog", AdminActivityLogSchema);
