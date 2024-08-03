const mongoose = require('mongoose');

const statementSchema = new mongoose.Schema({
  userid: {
    type: String,
    default: null
  },
  balance: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: null
  },
  message: {
    type: String,
    default: null
  },
  symbol_id: {
    type: String,
    default: null
  },
  createdAt: {
        type: Date,
        default: Date.now
},
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
});

const BalanceStatement = mongoose.model('BalanceStatement', statementSchema);

module.exports = BalanceStatement;
