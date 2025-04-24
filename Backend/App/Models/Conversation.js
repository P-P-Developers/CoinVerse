// 📁 models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'USER', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'USER', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Conversation', conversationSchema);