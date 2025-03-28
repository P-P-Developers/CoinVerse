const mongoose = require("mongoose");
const { BalanceStatement } = require(".");
const Schema = mongoose.Schema;

const ProfitmarginSchema = new Schema({
  adminid: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  balance: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProfitmarginData = mongoose.model("Profitmargin", ProfitmarginSchema);

module.exports = ProfitmarginData;
