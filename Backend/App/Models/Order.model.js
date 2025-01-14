const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userid: {
    type: String,
    default: null,
  },
  adminid: {
    type: String,
    default: null,
  },
  symbol: {
    type: String,
    default: null,
  },
  qty: {
    type: Number,
    default: null,
  },
  // Type Buy Sell
  type: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    default: null,
  },
  totalamount: {
    type: Number,
    default: null,
  },
  Role: {
    type: String,
    default: null,
},
  lot: {
    type: Number,
    default: null,
  },
  lotsize:{
    type: Number,
    default: null,
  },
  previous_trade_id: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
  requiredFund: {
    type: Number,
    default: null,
  },
  reason: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  pertrade: {
    type: Number,
    defaultValue: null,
  },
  perlot: {
    type: Number,
    default: null,
  },
  turn_over_percentage: {
    type: Number,
    default: null,
  },
  brokerage: {
    type: Number,
    default: null,
  },
  limit: {
    type: Number,
    default: null,
  },
  Profitloss: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
