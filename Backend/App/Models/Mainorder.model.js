const mongoose = require('mongoose');

const mainorderSchema = new mongoose.Schema({
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
    type: Number,
    default: null
  },
  // Type Buy Sell
  type: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    default: null
  }, 
  totalamount: {
    type: Number,
    default: null
  },
  lot: {
    type: Number,
    default: null
  },
  previous_trade_id: {
    type: String,
    default: null
  },
  type_entry_exit: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: null
  },
  sell_price:{
     type: Number,
    default: null
  },
  buy_price:{
     type: Number,
    default: null
  },
  buy_lot:{
    type: Number,
    default: null
  },
  sell_lot:{
    type: Number,
    default: null
  },
  sell_qty:{
    type: Number,
    default: null
  },
  buy_qty:{
    type: Number,
    default: null
  },
  buy_time:{
    type: Number,
    default: null
  },
  sell_time:{
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
},

});

const mainorder_model = mongoose.model('mainorder', mainorderSchema);



module.exports = mainorder_model;
