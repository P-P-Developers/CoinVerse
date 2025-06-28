"use strict";
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const { options } = require("../../Routes/Users/Userorder.routes");
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const User_model = db.user;
const MarginRequired = db.MarginRequired;
const BalanceStatement = db.BalanceStatement;
const mainorder_model = db.mainorder_model;
const Order = db.Order;
const broadcasting = db.broadcasting;
const Useraccount = db.Useraccount;
const user_logs = db.user_logs;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


class Users {


  // async userWithdrawalanddeposite(req, res) {
  //   try {
  //     const { userid, Balance, type, transactionId, ScreenShot } = req.body;


  //     const userdata = await User_model.findById({ _id: userid }).sort({
  //       createdAt: -1,
  //     });
  //     if (!userdata) {
  //       return res.json({ status: false, message: "User not found", data: [] });
  //     }

  //     if (Balance > 10000) {
  //       return res.json({
  //         status: false,
  //         message: "You can not " + type == 1 ? "Deposite" : "Withdrawal" + " more than 10000",
  //         data: [],
  //       });
  //     }


  //     const dollarPriceData = await MarginRequired.findOne({
  //       adminid: userdata.parent_id,
  //     }).select("dollarprice");
  //     if (!dollarPriceData) {
  //       return res.json({
  //         status: false,
  //         message: "Dollar price data not found",
  //         data: [],
  //       });
  //     }


  //     if (isNaN(Balance) || Balance <= 0) {
  //       return res.json({
  //         status: false,
  //         message: "Invalid or negative balance provided",
  //         data: [],
  //       });
  //     }


  //     const dollarcount = parseFloat(Balance).toFixed(6);

  //     const paymentHistory = new PaymenetHistorySchema({
  //       userid: userid,
  //       adminid: userdata.parent_id,
  //       Balance: dollarcount,
  //       type: type,
  //       status: 0,
  //       transactionId: transactionId,
  //       ScreenShot: ScreenShot,
  //     });

  //     await paymentHistory.save();

  //     req.io.emit("newTransactionRequest", {
  //       userid: userid,
  //       adminid: userdata.parent_id,
  //       username: userdata?.UserName || "",
  //       amount: dollarcount,
  //       type: type == 1 ? "Deposit" : "Withdrawal",
  //       time: new Date(),
  //       paymentHistoryId: paymentHistory._id,
  //     });


  //     return res.json({
  //       status: true,
  //       message: "Request sent",
  //       message: "Request sent",
  //       data: paymentHistory,
  //     });
  //   } catch (error) {
  //     return res.json({
  //       status: false,
  //       message: "Error to request send",
  //       data: [],
  //     });
  //   }
  // }



  async userWithdrawalanddeposite(req, res) {
    try {
      const { userid, Balance, type, transactionId, ScreenShot } = req.body;

      const userdata = await User_model.findById(userid);
      if (!userdata) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      if (isNaN(Balance) || Balance <= 0) {
        return res.json({
          status: false,
          message: "Invalid or negative balance provided",
          data: [],
        });
      }

      if (Balance > 10000) {
        return res.json({
          status: false,
          message: `You cannot ${type == 1 ? "Deposit" : "Withdraw"} more than 10000`,
          data: [],
        });
      }

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

      const dollarcount = parseFloat(Balance).toFixed(6);


      if (type == 1) {
        const existingDeposits = await PaymenetHistorySchema.find({
          userid: userid,
          type: 1,
        }).sort({ createdAt: 1 });

        if (existingDeposits.length === 0) {
          let planType = null;

          if (Balance == 100) {
            planType = 1;
          } else if (Balance == 500) {
            planType = 2;
          } else if (Balance == 1000) {
            planType = 3;
          }

          if (planType) {
            await User_model.findByIdAndUpdate(userid, {
              plan_type: planType,
              plan_balance: Balance,
            });
          }
        }
      }

      const paymentHistory = new PaymenetHistorySchema({
        userid: userid,
        adminid: userdata.parent_id,
        Balance: dollarcount,
        type: type,
        status: 0,
        transactionId: transactionId,
        ScreenShot: ScreenShot,
      });

      await paymentHistory.save();

      req.io.emit("newTransactionRequest", {
        userid: userid,
        adminid: userdata.parent_id,
        username: userdata?.UserName || "",
        amount: dollarcount,
        type: type == 1 ? "Deposit" : "Withdrawal",
        time: new Date(),
        paymentHistoryId: paymentHistory._id,
      });

      return res.json({
        status: true,
        message: "Request sent",
        data: paymentHistory,
      });
    } catch (error) {
      console.error("Error in withdrawal/deposit:", error);
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
      const result = await PaymenetHistorySchema.find({ userid: userid })
        .sort({
          createdAt: -1,
        })
        .select(
          "adminid userid Balance type status message notification_title createdAt ScreenShot transactionId"
        );

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
          "FullName Balance limit pertrade perlot turn_over_percentage brokerage UserName createdAt Start_Date End_Date ActiveStatus"
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
        .select("parent_id pertrade perlot transactionwise")
        .sort({ createdAt: -1 });

      const user = result1[0];

      const result = await MarginRequired.findOne({
        adminid: user.parent_id,
      }).select("crypto forex");

      if (!result) {
        return res.json({ status: false, message: "not found", data: [] });
      }

      let Obj = {
        option: user.pertrade && user.pertrade !== 0 ? "pertrade" : user.transactionwise !== 0 ? "transactionwise" : "perlot",
        value1:
          user.pertrade && user.pertrade !== 0 ? user.pertrade : user.transactionwise !== 0 ? user.transactionwise : user.perlot,
        crypto: result.crypto || 100,
        forex: result.forex || 100,
      };

      return res.json({
        status: true,
        message: "getting successfully",
        data: Obj,
      });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
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
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
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

      if (!userid) {
        return res.json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }

      const balanceStatements = await BalanceStatement.find({
        userid: userid,
        symbol: { $ne: null },
      }).sort({ createdAt: -1 });

      if (!balanceStatements || balanceStatements.length === 0) {
        return res.json({
          status: false,
          message: "Data not found",
          data: [],
        });
      }

      const orderIds = balanceStatements
        .flatMap((statement) => statement.orderid || [])
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));

      const orders = await Order.find(
        { _id: { $in: orderIds } },
        {
          _id: 1,
          totalamount: 1,
          lot: 1,
          qty: 1,
          lotSize: 1,
          Exittype: 1,
        }
      );

      // Map orders by _id for quick lookup
      const orderMap = new Map(
        orders.map((order) => [order._id.toString(), order])
      );

      // Enrich balance statements with order details
      const enrichedData = balanceStatements.map((statement) => {
        const enrichedOrders = (statement?.orderid || []).map((orderId) => {
          const orderDetails = orderMap?.get(orderId?.toString()) || {};
          return {
            orderid: orderId,
            totalAmount: orderDetails?.totalamount?.toFixed(4) || null,
            lot: orderDetails.lot || null,
            lotSize: orderDetails?.lotSize || null,
            qty: orderDetails.qty || null,
            Exittype: orderDetails?.Exittype || null,
          };
        });

        return {
          ...statement.toObject(),
          Amount: statement?.Amount?.toFixed(4), // Format the amount
          orders: enrichedOrders, // Add enriched order details
        };
      });

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: enrichedData,
      });
    } catch (error) {

      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  async tradeStatementForUser1(req, res) {
    try {
      const { userid } = req.body;

      if (!userid) {
        return res.json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }

      const balanceStatements = await BalanceStatement.aggregate([
        {
          $match: {
            userid: userid, // userid string me h
            symbol: { $ne: null },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $unwind: { path: "$orderid", preserveNullAndEmptyArrays: true }, // Unwind the orderid array
        },
        {
          $lookup: {
            from: "orders",
            localField: "orderid",
            foreignField: "_id",
            as: "orderDetails",
          },
        },
        {
          $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            totalamount: "$orderDetails.totalamount",
            lot: "$orderDetails.lot",
            qty: "$orderDetails.qty",
            lotSize: "$orderDetails.lotSize",
          },
        },
        {
          $project: {
            _id: 1,
            orderid: 1,
            symbol: 1,
            Amount: 1,
            createdAt: 1,
            type: 1,
            message: 1,
            brokerage: 1,
            totalamount: 1,
            lot: 1,
            qty: 1,
            lotSize: 1,
          },
        },
      ]);

      if (!balanceStatements || balanceStatements.length === 0) {
        return res.json({
          status: false,
          message: "No data found for the given user",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: balanceStatements, // Return the enriched data
      });
    } catch (error) {

      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  async tradeStatementForOrder(req, res) {
    try {
      const { orderid } = req.body;

      if (!orderid) {
        return res.json({
          status: false,
          message: "Order IDs are required",
          data: [],
        });
      }

      const TradeOrderId = await mainorder_model
        .find({ _id: orderid })
        .select("orderid");

      if (TradeOrderId?.length === 0) {
        return res.json({
          status: false,
          message: "Order not found",
          data: [],
        });
      }

      const DataArray = await Promise.all(
        TradeOrderId[0]?.orderid?.map(async (id) => {
          const results = await BalanceStatement.aggregate([
            {
              $match: {
                orderid: id, // Ensure `id` is a valid ObjectId or an array of ObjectIds
                symbol: { $ne: null },
              },
            },
            {
              $sort: { createdAt: -1 }, // Sort by createdAt in descending order
            },
            {
              $lookup: {
                from: "orders", // The name of the orders collection
                localField: "orderid", // Field in BalanceStatement containing orderid
                foreignField: "_id", // Field in orders collection to match
                as: "orderDetails", // Name of the field to store joined data
              },
            },
            {
              $unwind: "$orderDetails", // Unwind the orderDetails array to simplify results
            },
            {
              $addFields: {
                totalamount: "$orderDetails.totalamount",
                lot: "$orderDetails.lot",
                qty: "$orderDetails.qty",
                lotSize: "$orderDetails.lotSize",
                Exittype: "$orderDetails.Exittype",
              },
            },
            {
              $project: {
                _id: 1,
                orderid: 1,
                symbol: 1,
                Amount: 1,
                createdAt: 1,
                type: 1,
                message: 1,
                brokerage: 1,
                totalamount: 1,
                lot: 1,
                qty: 1,
                lotSize: 1,
                Exittype: 1,
              },
            },
          ]);

          // Apply toFixed(4) for Amount and totalamount in each document
          return results.map((doc) => ({
            ...doc,
            Amount: doc.Amount ? parseFloat(doc.Amount).toFixed(4) : null,
            totalamount: doc.totalamount
              ? parseFloat(doc.totalamount).toFixed(4)
              : null,
          }));
        })
      );

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: DataArray.flat(), // Flatten the array of results
      });
    } catch (error) {

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
        return res.send({
          status: false,
          message: "Pin must be a 4-digit number",
          data: [],
        });
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
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }

  async matchPin(req, res) {
    try {
      const { user_id, pin, fcm_token } = req.body;


      if (pin && !/^\d{4}$/.test(pin)) {
        return res.send({ status: false, message: "Invalid PIN", data: [] });
      }

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      if (user.ActiveStatus !== "1") {
        return res.send({
          status: false,
          message: "Account is not active",
          data: [],
        });
      }

      if (user.Role === "USER" || user.Role === "ADMIN") {
        const currentDate = new Date();
        const endDate = new Date(user.End_Date);


      }

      // If pin_status is false, return a message to generate the pin first
      if (!user.pin_status) {
        return res.send({
          status: false,
          message: "Please generate your PIN first",
          data: [],
        });
      }

      // Compare the entered pin with the stored pin
      if (user.pin !== pin) {
        return res.send({ status: false, message: "Incorrect pin", data: [] });
      }

      var token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 28800,
      });

      const user_login = new user_logs({
        user_Id: user._id,
        admin_Id: user.parent_id || "",
        UserName: user.UserName,
        login_status: "Panel On",
        role: user.Role,
        DeviceToken: "",
      });

      await user_login.save();

      return res.send({
        status: true,
        message: "Pin matched successfully",
        data: {
          token: token,
          Role: user.Role,
          user_id: user._id,
          UserName: user.UserName,
          ReferralCode: user.ReferralCode,
          ReferredBy: user.ReferredBy,
          parent_id: user.parent_id,
        },
      });
    } catch (error) {
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }


  async FingerAuth(req, res) {
    try {
      const { user_id, fcm_token } = req.body;



      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      if (user.ActiveStatus !== "1") {
        return res.send({
          status: false,
          message: "Account is not active",
          data: [],
        });
      }

      if (user.Role === "USER" || user.Role === "ADMIN") {
        const currentDate = new Date();
        const endDate = new Date(user.End_Date);


      }

      // If pin_status is false, return a message to generate the pin first
      if (!user.pin_status) {
        return res.send({
          status: false,
          message: "Please generate your PIN first",
          data: [],
        });
      }



      var token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 28800,
      });

      // Create user login log
      const user_login = new user_logs({
        user_Id: user._id,
        admin_Id: user.parent_id || "",
        UserName: user.UserName,
        login_status: "Panel On",
        role: user.Role,
        DeviceToken: "",
      });

      await user_login.save();

      return res.send({
        status: true,
        message: "Pin matched successfully",
        data: {
          token: token,
          Role: user.Role,
          user_id: user._id,
          UserName: user.UserName,
          ReferralCode: user.ReferralCode,
          ReferredBy: user.ReferredBy,
          parent_id: user.parent_id,
        },
      });
    } catch (error) {
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }

  async changePin(req, res) {
    try {
      const { user_id, pin, newPin, confirmNewPin } = req.body;

      if (pin && !/^\d{4}$/.test(pin)) {
        return res.send({
          status: false,
          message: "Invalid Old PIN",
          data: [],
        });
      }
      // Validate the new PIN and confirm PIN to ensure they're 4
      if (!/^\d{4}$/.test(newPin)) {
        return res.send({
          status: false,
          message: "Invalid New PIN",
          data: [],
        });
      }

      if (newPin !== confirmNewPin) {
        return res.send({
          status: false,
          message: "New Pin and Confirm Pin don't match",
          data: [],
        });
      }

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      if (!user.pin_status) {
        return res.send({
          status: false,
          message: "Please generate your PIN first",
          data: [],
        });
      }

      if (user.pin !== pin) {
        return res.send({
          status: false,
          message: "Incorrect Old PIN",
          data: [],
        });
      }

      if (newPin === pin) {
        return res.send({
          status: false,
          message: "New PIN cannot be the same as the old PIN",
          data: [],
        });
      }

      user.pin = newPin;
      await user.save();

      return res.send({
        status: true,
        message: "PIN updated successfully",
        data: [],
      });
    } catch (error) {
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }


  async ForgotPin(req, res) {
    try {
      const { user_id, password, newPin } = req.body;

      if (!user_id || !password || !newPin) {
        return res.status(400).send({
          status: false,
          message: "Missing required fields",
          data: [],
        });
      }

      const user = await User_model.findOne({ _id: user_id });

      if (!user) {
        return res.status(404).send({
          status: false,
          message: "User does not exist",
          data: [],
        });
      }

      if (user.ActiveStatus !== "1") {
        return res.status(403).send({
          status: false,
          message: "Account is not active",
          data: [],
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send({
          status: false,
          message: "Incorrect password",
          data: [],
        });
      }

      if (!/^\d{4}$/.test(newPin)) {
        return res.status(400).send({
          status: false,
          message: "New PIN must be a 4-digit number",
          data: [],
        });
      }

      user.pin = newPin;
      user.pin_status = true;
      await user.save();

      return res.status(200).send({
        status: true,
        message: "PIN updated successfully",
        data: [],
      });

    } catch (error) {
      console.error("ForgotPin error:", error);
      return res.status(500).send({
        status: false,
        message: "Internal server error",
        data: error,
      });
    }
  }

  async getUserAccountDetails(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.json({
          status: false,
          message: "Invalid User ID",
          data: [],
        });
      }

      // ✅ Find all accounts for the given userId
      const userAccountDetails = await Useraccount.find({
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!userAccountDetails || userAccountDetails.length === 0) {
        return res.json({
          status: false,
          message: "User account details not found",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "User account details retrieved successfully",
        data: userAccountDetails, // 👈 array of accounts
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  async updateUserAccountDetails(req, res) {
    try {
      const {
        userId,
        upiId,
        accountHolderName,
        bankName,
        bankAccountNo,
        bankIfsc,
      } = req.body;


      if (!userId) {
        return res.status(400).json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          status: false,
          message: "Invalid userId format",
          data: [],
        });
      }

      // ✅ Directly Create a New Account Entry
      const newAccount = new Useraccount({
        userId: new mongoose.Types.ObjectId(userId),
        upiId,
        accountHolderName,
        bankName,
        bankAccountNo,
        bankIfsc,
      });

      const savedAccount = await newAccount.save();


      return res.status(201).json({
        status: true,
        message: "New user account added successfully",
        data: savedAccount,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }
}

module.exports = new Users();
