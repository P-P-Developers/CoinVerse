"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const { findOne } = require("../../Models/Role.model");
const Symbol = db.Symbol;
const Userwatchlist = db.Userwatchlist;
const Order = db.Order;
const WalletRecharge = db.WalletRecharge;
const User_model = db.user;
const mainorder_model = db.mainorder_model;

class Placeorder {
  async placeorder(req, res) {
    try {
      const entry_exit = req.body.entry_exit;
      if (entry_exit == "ENTRY") {
        await EntryTrade(req, res);
      } else if (entry_exit == "EXIT") {
        await ExitTrade(req, res);
      } else {
        return res.json({ status: false, msg: "Invalid request" });
      }
    } catch (error) {
      res.json({ message: "Server error", error: error.message });
    }
  }

  // order history
  async getOrderBook(req, res) {
    try {
      const { userid } = req.body;

      const result = await Order.find({ userid: userid });

      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      return res.json({ status: true, message: "User found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }
}

// for entry trade



const EntryTrade = async (req, res) => {
  try {
    const { userid, symbol, price, lot, qty, requiredFund, token, type } = req.body;

   
    const checkadmin = await User_model.findOne({ _id: userid, Role: "USER" });

    if (!checkadmin) {
      return res.json({ status: false, message: "User not found", data: [] });
    }



      




    
    if (checkadmin.Balance < requiredFund) {
      const rejectedOrder = new Order({
        userid,
        symbol,
        price,
        lot,
        qty,
        adminid: checkadmin.parent_id,
        requiredFund,
        token,
        type,
        status: "rejected",
        reason: "Order rejected due to low Balance",
      });

      await rejectedOrder.save();
      return res.status(400).json({
        status: false,
        message: "Order rejected due to low Balance",
        order: rejectedOrder,
      });
    } else {
      const newOrder = new Order({
        userid,
        symbol,
        price,
        lot,
        qty,
        adminid: checkadmin.parent_id,
        pertrade: checkadmin.userdata,
        perlot: checkadmin.perlot,
        turn_over_percentage: checkadmin.turn_over_percentage,
        brokerage: checkadmin.brokerage,
        limit: checkadmin.limit,
        requiredFund,
        token,
        type,
        status: "Completed",
      });


      const orderdata = await newOrder.save();
      let tradehistory = await mainorder_model.findOne({ userid, symbol });

      if (type === "buy") {
        if (tradehistory) {
          // tradehistory.symbol = symbol;
          // tradehistory.buy_price = price;
          // tradehistory.buy_lot = lot;
          // tradehistory.buy_qty = qty;
          // tradehistory.buy_type = type;
          // tradehistory.requiredFund = requiredFund;
          // tradehistory.token = token;
          // tradehistory.adminid = checkadmin.parent_id;
          // tradehistory.pertrade = checkadmin.userdata;
          // tradehistory.perlot = checkadmin.perlot;
          // tradehistory.turn_over_percentage = checkadmin.turn_over_percentage;
          // tradehistory.brokerage = checkadmin.brokerage;
          // tradehistory.limit = checkadmin.limit;
          // tradehistory.status = "Completed";

          // await tradehistory.save();
        } else {
          tradehistory = new mainorder_model({
            orderid: orderdata._id,
            userid,
            symbol,
            buy_price: price,
            buy_lot: lot,
            buy_qty: qty,
            buy_type: type,
            requiredFund,
            token,
            adminid: checkadmin.parent_id,
            pertrade: checkadmin.userdata,
            perlot: checkadmin.perlot,
            turn_over_percentage: checkadmin.turn_over_percentage,
            brokerage: checkadmin.brokerage,
            limit: checkadmin.limit,
            status: "Completed",
          });

          await tradehistory.save();
        }
      } else {
        if (tradehistory) {
          // tradehistory.symbol = symbol;
          // tradehistory.sell_price = price;
          // tradehistory.sell_lot = lot;
          // tradehistory.sell_qty = qty;
          // tradehistory.sell_type = type;
          // tradehistory.requiredFund = requiredFund;
          // tradehistory.token = token;
          // tradehistory.adminid = checkadmin.parent_id;
          // tradehistory.pertrade = checkadmin.userdata;
          // tradehistory.perlot = checkadmin.perlot;
          // tradehistory.turn_over_percentage = checkadmin.turn_over_percentage;
          // tradehistory.brokerage = checkadmin.brokerage;
          // tradehistory.limit = checkadmin.limit;
          // tradehistory.status = "Completed";

          // await tradehistory.save();

        } else {
          tradehistory = new mainorder_model({
            orderid: orderdata._id,
            userid,
            symbol,
            sell_price: price,
            sell_lot: lot,
            sell_qty: qty,
            sell_type: type,
            requiredFund,
            token,
            adminid: checkadmin.parent_id,
            pertrade: checkadmin.userdata,
            perlot: checkadmin.perlot,
            turn_over_percentage: checkadmin.turn_over_percentage,
            brokerage: checkadmin.brokerage,
            limit: checkadmin.limit,
            status: "Completed",
          });

          await tradehistory.save();
        }
      }

      return res.status(200).json({
        status: true,
        message: "Order placed",
        order: newOrder,
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", data: [] });
  }
};






// for exit trade

const ExitTrade = async (req, res) => {
  const { userid, symbol, price, lot, qty } = req.body;

  const checkadmin = await User_model.findOne({ _id: userid, Role: "USER" });

  if (!checkadmin) {
    return res.json({ message: "User not found" });
  }

  const adminId = checkadmin.parent_id;

  let order = await Order.findOne({ userid, symbol });

  if (order) {
    order.status = "closed";
    order.exitPrice = price;
    order.lot = lot;
    order.qty = qty;
    order.adminid = adminId;
    await order.save();

    res.json({ status: true, message: "Order exited successfully", order });
  } else {
    res.json({ status: false, msg: "No active order found to exit", data: [] });
  }
};

module.exports = new Placeorder();
