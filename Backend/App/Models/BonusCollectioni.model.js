
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
 

const BonusSchema = new Schema(
    {
      admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER", // Assuming admin is stored in USER model
        required: true,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER", // Assuming user is also stored in USER model
        required: true,
      },
      Bonus: {
        type: Number,
        required: true,
      },
      Type: {
        type: String,
        enum: ["Fixed_PerClient", "Fund_Add", "Every_Transaction"],  
        required: true,
      },
      username: {
        type: String,
        required: true,
      },

      
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = model("Bonus", BonusSchema);