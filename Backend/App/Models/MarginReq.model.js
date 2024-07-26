const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marginReqPerSchema = new Schema(
  {
    adminid: {
      type: String,
      default: null,
    },
    forex: {
      type: Number,
      default: null,
    },
    crypto: {
      type: Number,
      default: null,
    },
    dollarprice:{
        type: Number,
        default: null,
    }
  },
  {
    timestamps: true,
  }
);

const MarginRequired = mongoose.model("MarginRequired", marginReqPerSchema);

module.exports = MarginRequired;
