const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true // e.g., "BTCUSDT"
  },
  initialPrice: {
    type: Number,
    required: true // e.g., 100000
  },
  dropThreshold: {
    type: Number,
    required: true, // e.g., 1000 (drop amount)
    default: 1000
  },
  timeWindow: {
    type: Number,
    required: true, // in seconds
    default: 60 // 1 minute
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  triggered: {
    type: Boolean,
    default: false
  },
  triggeredAt: {
    type: Date,
    default: null
  },
  logs: [
    {
      price: Number,
      time: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('Condition', ConditionSchema);
