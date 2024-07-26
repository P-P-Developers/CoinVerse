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


  async placeorder(req, res) {
    try {
      // Destructure request body to extract order details
      const { userid, symbol, price, lot, qty, requiredFund, token, type, entry_exit } = req.body;

      // Check if the user exists and has the role of "USER"
      const checkadmin = await User_model.findOne({ _id: userid, Role: "USER" });
      if (!checkadmin) {
        return res.status(404).json({ status: false, message: "User not found", data: [] });
      }

      const SymbolToken = await Symbol.findOne({ symbol: symbol });



      // Check if the user has sufficient balance for the order
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

        // Save the rejected order and return a response
        await rejectedOrder.save();
        return res.status(400).json({
          status: false,
          message: "Order rejected due to low Balance",
          order: rejectedOrder,
        });
      }

      // Create a new order object
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
        token: SymbolToken,
        type,
        status: "Completed",
      });

      // Save the new order to the database
      const orderdata = await newOrder.save();

      // Call appropriate trade function based on order type
      if (type === "buy") {
        await EntryTrade(req, res, orderdata, checkadmin, SymbolToken);
      } else if (type === "sell") {
        await ExitTrade(req, res, orderdata, checkadmin, SymbolToken);
      } else {
        return res.status(400).json({ status: false, message: "Invalid request" });
      }

    } catch (error) {
      // Return server error response
      res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
  }



}




const EntryTrade = async (req, res, orderdata, checkadmin, SymbolToken) => {
  try {
    const { userid, symbol, price, lot, qty, requiredFund, token, type } = req.body;

    const priceNum = parseFloat(price);
    const lotNum = parseInt(lot, 10);
    const qtyNum = parseInt(qty, 10);
    const requiredFundNum = parseFloat(requiredFund);

    let tradehistory = await mainorder_model.findOne({ userid, symbol });

    if (tradehistory) {

      const totalQuantity = tradehistory.buy_lot + lotNum;
      const totalCost = tradehistory.buy_price * tradehistory.buy_lot + priceNum * lotNum;
      const avgPrice = totalCost / totalQuantity;

      tradehistory.buy_price = avgPrice;
      tradehistory.buy_lot += lotNum;
      tradehistory.buy_qty += qtyNum;
      tradehistory.buy_type = type;

      await tradehistory.save();

    } else {

      tradehistory = new mainorder_model({
        orderid: orderdata._id,
        userid,
        symbol,
        buy_type: type,
        buy_price: price,
        buy_lot: lot,
        buy_qty: qty,
        buy_time: new Date(),
        requiredFund,
        token: SymbolToken.token,
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

    return res.status(200).json({
      status: true,
      message: "Order placed",

    });

  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ status: false, message: "Server error", data: [] });
  }
};



const ExitTrade = async (req, res, orderdata, checkadmin) => {
  const { userid, symbol, price, type, lot, qty } = req.body;


  const priceNum = parseFloat(price);
  const lotNum = parseInt(lot, 10);
  const qtyNum = parseInt(qty, 10);
  // const requiredFundNum = parseFloat(requiredFund);


  let tradehistory = await mainorder_model.findOne({ userid, symbol });

  if (tradehistory) {
    if (tradehistory.buy_lot >= parseInt(lot) + parseInt(tradehistory.sell_lot)) {

      if (tradehistory.sell_lot == null && tradehistory.sell_price == null) {
        tradehistory.sell_price = price;
        tradehistory.sell_lot = lot;
        tradehistory.sell_qty = qty;
        tradehistory.sell_type = type;
        tradehistory.sell_time = new Date();
        await tradehistory.save();
      } else {
        const totalQuantity = tradehistory.sell_lot + lotNum;
        const totalCost = tradehistory.sell_price * tradehistory.sell_lot + priceNum * lotNum;
        const avgPrice = totalCost / totalQuantity;

        tradehistory.sell_price = avgPrice;
        tradehistory.sell_lot += lotNum;
        tradehistory.sell_qty += qtyNum;
        tradehistory.sell_type = type;

        await tradehistory.save();

      }

    } else {
      console.log("Entry Not Exist")

    }
  } else {
    console.log("Entry Not Exist")
  }

  return res.status(200).json({
    status: true,
    message: "Order placed",

  });


};

module.exports = new Placeorder();
