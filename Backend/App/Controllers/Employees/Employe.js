"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const totalLicense = db.totalLicense;
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const MarginRequired = db.MarginRequired;
const Symbol = db.Symbol;
const BalanceStatement = db.BalanceStatement;
const mainorder_model = db.mainorder_model;
const employee_model = db.employee_model
const employee_permission = db.employee_permission;


class employee{

    // get admin detail for employee

  async getEmployeedata(req, res) {
    try {
      const { id } = req.body;
    
      const result = await User_model.find({employee_id:id});

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "getting data",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

 
  
  async getEmployee_permissiondata(req, res) {
    try {
      const { id } = req.body;
    
      const result = await employee_permission.find({employee_id:id});

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "getting data",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }


}

module.exports = new employee();