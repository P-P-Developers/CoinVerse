const mongoose = require("mongoose");

const mainorderSchema = new mongoose.Schema({
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
  // Type Buy Sell
  buy_type: {
    type: String,
    default: null,
  },
  sell_type: {
    type: String,
    default: null,
  },
  buy_price: {
    type: Number,
    default: null,
  },
  sell_price: {
    type: Number,
    default: null,
  },
  buy_lot: {
    type: Number,
    default: null,
  },
  sell_lot: {
    type: Number,
    default: null,
  },

  buy_qty: {
    type: Number,
    default: null,
  },
  sell_qty: {
    type: Number,
    default: null,
  },
  buy_time: {
    type: Date,
    default: null,
  },
  sell_time: {
    type: Date,
    default: null,
  },
  signal_type: {
    type: String,
    default: null,
  },
  totalamount: {
    type: Number,
    default: null,
  },
  previous_trade_id: {
    type: String,
    default: null,
  },
  type_entry_exit: {
    type: String,
    default: null,
  },
  lotsize: {
    type: Number,
    default: null,
  },
  token: {
    type: String,
    default: null,
    index: true,
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
    type: String,
    default: null,
  },
  limit: {
    type: String,
    default: null,
  },
  profitloss: {
    type: String,
    default: null,
  },
  Sl_price_percentage: {
    type: String,
    default: null,
  },
  Target_price: {
    type: String,
    default: null,
  },
  stoploss_price: {
    type: String,
    default: null,
  },
  Exittype: {
    type: String,
    default: null,
  },

  orderid: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const mainorder_model = mongoose.model("mainorder", mainorderSchema);

module.exports = mainorder_model;
