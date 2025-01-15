const mongoose = require('mongoose');

const userwatchlistSchema = new mongoose.Schema({
  userid: {
    type: String,
    default: null
  },
  symbol: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: null
  },
  symbol_name: {
    type: String,
    default: null
  },
  exch_seg: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
},
  isFav: {
    type: Boolean,
    default: false
  }
});

const Userwatchlist = mongoose.model('Userwatchlist', userwatchlistSchema);

module.exports = Userwatchlist;
