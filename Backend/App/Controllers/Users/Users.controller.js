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
const MarginRequired = db.MarginRequired;
const BalanceStatement = db.BalanceStatement;
const mainorder_model = db.mainorder_model;
const broadcasting = db.broadcasting;

class Users {
  // userWithdrawalanddeposite
  async userWithdrawalanddeposite(req, res) {
    try {
      const { userid, Balance, type } = req.body;

      const userdata = await User_model.findById({ _id: userid }).sort({ createdAt: -1 });
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
        message: "Request sent",
        data: paymentHistory,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Error in sending request",
        data: [],
      });
    }
  }

  // get payment history
  async getpaymenthistory(req, res) {
    try {
      const { userid } = req.body;
      const result = await PaymenetHistorySchema.find({ userid: userid }).sort({ createdAt: -1 });

      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }
      return res.json({
        status: true,
        message: "Find Successfully",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  // get all users
  async getAllUsers(req, res) {
    try {
      const users = await User_model.find({ Role: "USER" })
        .select("FullName Balance limit pertrade perlot turn_over_percentage brokerage UserName createdAt")
        .sort({ createdAt: -1 });

      if (!users || users.length === 0) {
        return res.json({ status: false, message: "No users found", data: [] });
      }

      return res.json({
        status: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // get user detail
  async getUserDetail(req, res) {
    try {
      const { userid } = req.body;
      const result = await User_model.find({ _id: userid, Role: "USER" })
        .select("FullName Balance limit pertrade perlot turn_over_percentage brokerage UserName createdAt")
        .sort({ createdAt: -1 });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "Data retrieved",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // margin value for user
  async getmarginpriceforuser(req, res) {
    try {
      const { userid } = req.body;
      const result1 = await User_model.find({ _id: userid }).select("parent_id").sort({ createdAt: -1 });

      const result = await MarginRequired.findOne({ adminid: result1[0].parent_id }).select("crypto forex");
      if (!result) {
        return res.json({ status: false, message: "Not found", data: [] });
      }
      return res.json({ status: true, message: "Data retrieved", data: result });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // get all statements
  async getAllstatement(req, res) {
    try {
      const { userid } = req.body;
      const result = await BalanceStatement.aggregate([
        { $match: { userid: userid } },
        {
          $lookup: {
            from: "orders",
            localField: "orderid",
            foreignField: "_id",
            as: "orderDetails",
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      if (!result.length) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      return res.json({ status: true, message: "User found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // get user orders for today
  async getuserorderdata(req, res) {
    try {
      const { userid, symbol } = req.body;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const result = await mainorder_model.find({
        userid: userid,
        symbol: symbol,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "Data retrieved",
        data: result,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  // today's broadcast messages
  async todaysBroadcastMessage(req, res) {
    try {
      const { userId } = req.body;
  
      if (!userId) {
        return res.json({ status: false, message: "User ID is required", data: [] });
      }
  
      const user = await User_model.findOne({ _id: new ObjectId(userId) }).select("parent_id");
  
      if (!user || !user.parent_id) {
        return res.json({ status: false, message: "Admin ID not found for the user", data: [] });
      }
  
      const adminId = user.parent_id;
  
      // Define start and end of today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
  
      // Query for broadcasts created today
      const data = await broadcasting.find({
        adminid: new ObjectId(adminId),
        createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for today's date
      });
  
      return res.json({ status: true, message: "Data found", data: data });
    } catch (error) {
      console.log("Error in todaysBroadcastMessage:", error);
      return res.json({ status: false, message: "Internal server error", data: [] });
    }
  }

  async balanceStatementForUser(req, res) {
    try {
      const { userid } = req.body;

      // const userid = "67601364dbc56d9bed6650b9"
  
      // Verify userid
      if (!userid) {
        return res.json({ status: false, message: "User ID is required", data: [] });
      }
  
      console.log("Query Parameters:", { userid: userid, symbol: { $eq: null } });
  
      const result = await BalanceStatement.find({
        userid: userid,
        symbol: { $eq: null },
      }).sort({ createdAt: -1 });
  
      console.log("Result:", result);
  
      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }
  
      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in balanceStatementForUser:", error);
  
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }
  

  
  async tradeStatementForUser(req, res) {
    try {
      const { userid } = req.body;

      // const userid = "67601364dbc56d9bed6650b9"
  
      // Verify userid
      if (!userid) {
        return res.json({ status: false, message: "User ID is required", data: [] });
      }
  
      console.log("Query Parameters:", { userid: userid, symbol: { $eq: null } });
  
      const result = await BalanceStatement.find({
        userid: userid,
        symbol: { $ne: null },
      }).sort({ createdAt: -1 });
  
      console.log("Result:", result);
  
      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }
  
      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in balanceStatementForUser:", error);
  
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }
  
  
}

module.exports = new Users();
