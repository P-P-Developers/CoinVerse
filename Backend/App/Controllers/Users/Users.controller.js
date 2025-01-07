"use strict";
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const User_model = db.user;
const MarginRequired = db.MarginRequired;
const BalanceStatement = db.BalanceStatement;
const mainorder_model = db.mainorder_model;
const broadcasting = db.broadcasting;

class Users {

  async userWithdrawalanddeposite(req, res) {
    try {
      const { userid, Balance, type } = req.body;

      // Fetch user data
      const userdata = await User_model.findById({ _id: userid }).sort({
        createdAt: -1,
      });
      if (!userdata) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      // Fetch dollar price data
      const dollarPriceData = await MarginRequired.findOne({
        adminid: userdata.parent_id,
      }).select("dollarprice");
      if (!dollarPriceData) {
        return res.json({
          status: false,
          message: "Dollar price data not found",
          data: [],
        });
      }

      // Validate and convert Balance to dollars
      if (isNaN(Balance) || Balance <= 0) {
        return res.json({
          status: false,
          message: "Invalid or negative balance provided",
          data: [],
        });
      }

      // const dollarPrice = parseFloat(dollarPriceData.dollarprice);
      const dollarcount = parseFloat(Balance).toFixed(6);

      // Create payment history entry
      const paymentHistory = new PaymenetHistorySchema({
        userid: userid,
        adminid: userdata.parent_id,
        Balance: dollarcount, // Store the converted dollar amount
        type: type,
        status: 0,
      });

      await paymentHistory.save();

      return res.json({
        status: true,
        message: "Request sent",
        message: "Request sent",
        data: paymentHistory,
      });
    } catch (error) {
      console.error("Error in userWithdrawalanddeposite:", error);
      return res.json({
        status: false,
        message: "Error to request send",
        data: [],
      });
    }
  }

  async getpaymenthistory(req, res) {
    try {
      const { userid } = req.body;
      const result = await PaymenetHistorySchema.find({ userid: userid }).sort({
        createdAt: -1,
      });

      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }
      return res.json({
        status: true,
        message: "Find Successfully",
        data: result,
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  // testing for get all users
  async getAllUsers(req, res) {
    try {
      const users = await User_model.find({ Role: "USER" })
        .select(
          "FullName Balance limit pertrade perlot turn_over_percentage brokerage UserName createdAt"
        )
        .sort({ createdAt: -1 }); // Optionally, you can sort by createdAt or remove it if not needed

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

  // get user
  async getUserDetail(req, res) {
    try {
      const { userid } = req.body;

      const result = await User_model.find({ _id: userid, Role: "USER" })
        .select(
          "FullName Balance limit pertrade perlot turn_over_percentage brokerage UserName createdAt"
        )
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

  //margin value for user
  async getmarginpriceforuser(req, res) {
    try {
      const { userid } = req.body;
      const result1 = await User_model.find({ _id: userid })
        .select("parent_id")
        .sort({ createdAt: -1 });

      const result = await MarginRequired.findOne({
        adminid: result1[0].parent_id,
      }).select("crypto forex");

      if (!result) {
        return res.json({ status: false, message: "not found", data: [] });
      }
      return res.json({
        status: true,
        message: "getting successfully",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "inernal error", data: [] });
    }
  }

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
      if (!result.length) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      return res.json({ status: true, message: "User found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // get all orderposition of today
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
        return res.json({
          status: false,
          message: "Data not found",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Data found",
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
        return res.json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }

      const user = await User_model.findOne({
        _id: new ObjectId(userId),
      }).select("parent_id");

      if (!user || !user.parent_id) {
        return res.json({
          status: false,
          message: "Admin ID not found for the user",
          data: [],
        });
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
      return res.json({ status: false, message: "Internal server error", data: [] });
    }
  }

  async balanceStatementForUser(req, res) {
    try {
      const { userid } = req.body;

      // Verify userid
      if (!userid) {
        return res.json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }


      const result = await BalanceStatement.find({
        userid: userid,
        symbol: { $eq: null },
      }).sort({ createdAt: -1 });


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

      // Verify userid
      if (!userid) {
        return res.json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }


      const result = await BalanceStatement.find({
        userid: userid,
        symbol: { $ne: null },
      }).sort({ createdAt: -1 });

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

  async generatePin(req, res) {
    try {
      const { user_id, pin } = req.body;

      // Validate that the pin is exactly 4 digits if it's provided
      if (pin && !/^\d{4}$/.test(pin)) {
        return res.send({ status: false, message: "Pin must be a 4-digit number", data: [] });
      }

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      user.pin = pin;
      user.pin_status = true;

      await user.save();

      return res.send({
        status: true,
        message: "Pin generated successfully",
        data: { user_id: user._id },
      });
    } catch (error) {
      return res.send({ status: false, message: "Server side error", data: error });
    }
  };

  async matchPin(req, res) {
    try {
      const { user_id, pin } = req.body;

      if (pin && !/^\d{4}$/.test(pin)) {
        return res.send({ status: false, message: "Invalid PIN", data: [] });
      }

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      // If pin_status is false, return a message to generate the pin first
      if (!user.pin_status) {
        return res.send({ status: false, message: "Please generate your PIN first", data: [] });
      }

      // Compare the entered pin with the stored pin
      if (user.pin !== pin) {
        return res.send({ status: false, message: "Incorrect pin", data: [] });
      }

      return res.send({
        status: true,
        message: "Pin matched successfully",
        data: { user_id: user._id },
      });
    } catch (error) {
      return res.send({ status: false, message: "Server side error", data: error });
    }
  };

  async changePin(req, res) {
    try {
      const { user_id, pin, newPin, confirmNewPin } = req.body;

      if (pin && !/^\d{4}$/.test(pin)) {
        return res.send({ status: false, message: "Invalid Old PIN", data: [] });
      }

      // Validate the new PIN and confirm PIN to ensure they're 4 
      if (!/^\d{4}$/.test(newPin)) {
        return res.send({ status: false, message: "Invalid New PIN", data: [] });
      }

      if (newPin !== confirmNewPin) {
        return res.send({ status: false, message: "New Pin and Confirm Pin don't match", data: [] });
      }

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      if (!user.pin_status) {
        return res.send({ status: false, message: "Please generate your PIN first", data: [] });
      }

      if (user.pin !== pin) {
        return res.send({ status: false, message: "Incorrect Old PIN", data: [] });
      }

      if (newPin === pin) {
        return res.send({ status: false, message: "New PIN cannot be the same as the old PIN", data: [] });
      }

      user.pin = newPin;
      await user.save();

      return res.send({ status: true, message: "PIN updated successfully", data: [] });
    } catch (error) {
      return res.send({ status: false, message: "Server side error", data: error });
    }
  }





}

module.exports = new Users();
