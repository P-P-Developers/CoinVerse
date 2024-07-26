"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const Symbol = db.Symbol;
const Userwatchlist = db.Userwatchlist;
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const User_model = db.user;
const Wallet_model = db.WalletRecharge;
const MarginRequired = db.MarginRequired


class Users {
  


  //userWithdrawalanddeposite
  
  async userWithdrawalanddeposite(req, res) {
    try {
      const { userid, Balance, type } = req.body;

      const userdata = await User_model.findById({ _id: userid});

      if (!userdata) {
        return res.json({ status: false, message: "User not found", data: [] });
      }
       

      const dollarPriceData = await MarginRequired.findOne({ adminid: userdata.parent_id }).select("dollarprice");
      if (!dollarPriceData) {
        return res.json({ status: false, message: "Dollar price data not found", data: [] });
      }
  

      const dollarcount = (Balance / dollarPriceData.dollarprice).toFixed(3);
      
      const paymentHistory = new PaymenetHistorySchema({
        userid: userid,
        adminid: userdata.parent_id,
        Balance: dollarcount,
        type: type,
        status: 0,
      });

      await paymentHistory.save();

      return res.json({
        status: true,
        message: "Request send",
        data: paymentHistory,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Error to Request send",
        data: [],
      });
    }
  }

  async getpaymenthistory(req, res) {
    try {
      const { userid } = req.body;
      const result = await PaymenetHistorySchema.find({ userid: userid });

      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }
      return res.json({
        status: true,
        message: "Find Successfully",
        data:result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  
  // get user

  async getUserDetail(req, res) {
    try {
      const { userid } = req.body;

      const result = await User_model.find({_id:userid, Role:"USER" }).select(
        "FullName Balance limit pertrade perlot turn_over_percentage brokerage UserName createdAt"
      );

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

module.exports = new Users();
