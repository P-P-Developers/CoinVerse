const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userid: {
    type: String,
    default: null
  },
  adminid: {
    type: String,
    default: null
  },
  symbol: {
    type: String,
    default: null
  },
  qty: {
    type: String,
    default: null
  },
  // Type Buy Sell
  type: {
    type: String,
    default: null
  },
  price: {
    type: String,
    default: null
  }, 
  totalamount: {
    type: String,
    default: null
  },
  lot: {
    type: String,
    default: null
  },
  previous_trade_id: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
},
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
