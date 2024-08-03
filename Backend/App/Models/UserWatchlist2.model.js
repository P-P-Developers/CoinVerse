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
});

const Userwatchlist2 = mongoose.model('Userwatchlist2', userwatchlistSchema);

module.exports = Userwatchlist2;
