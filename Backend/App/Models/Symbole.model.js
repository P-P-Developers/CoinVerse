const mongoose = require('mongoose');

const symbolSchema =  new mongoose.Schema({
    symbol: {
      type: String,
      default: null
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
   
    trading_symbol: {
      type: String,
      default: null
    },
    exch_seg: {
      type: String,
      default: null
    },
    lotsize: {
      type: Number,
      default: 1
    },
    status:{
      type: Number,
      enum: [0,1],
    }
   
  }, { versionKey: false }); 
  
  const Symbol = mongoose.model('Symbol', symbolSchema);
  
  module.exports = Symbol;
