const mongoose = require("mongoose");

// Define the schema for the company settings
const companySchema = new mongoose.Schema(
  {
    panelName: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    favicon: {
      type: String,
      required: true,
    },
    loginImage: {
      type: String,
      required: true,
    },
    loginUrl: {
      type: String,
      required: true,
    },
    startOfDay: {
      type: Date,
    },
    endOfDay: {
      type: Date,
    },
    port: {
      type: String,
    },
    Basic_plan: {
      type: Number,
      default: null
    },
    Standard_plan: {
      type: Number,
      default: null
    },
    Premium_plan: {
      type: Number,
      default: null
    },
    version: {
      type: String,
      default: "1.0.0"
    },
  },
  { timestamps: true }
);

// Create and export the model
const Company = mongoose.model("Company", companySchema);
module.exports = Company;
