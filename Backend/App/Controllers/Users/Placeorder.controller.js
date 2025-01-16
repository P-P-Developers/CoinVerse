"use strict";

const db = require("../../Models");
const { findOne } = require("../../Models/Role.model");
const Symbol = db.Symbol;
const Order = db.Order;
const User_model = db.user;
const mainorder_model = db.mainorder_model;
const BalanceStatement = db.BalanceStatement;

class Placeorder {
  // get order book
  async getOrderBook(req, res) {
    try {
      const { userid } = req.body;

      const result = await Order.find({ userid }).sort({ createdAt: -1 });

      if (!result.length) {
        return res.json({
          status: false,
          message: "No orders found for this user",
          data: [],
        });
      }
      return res.json({ status: true, message: "Orders found", data: result });
    } catch (error) {
      console.log("Error fetching order book:", error);
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  // get trade history
  async gettardehistory(req, res) {
    try {
      const { userid, Role } = req.body;

      let result;

      if (Role === "USER") {
        result = await mainorder_model
          .find({ userid: userid })
          .sort({ createdAt: -1 });
        if (result.length > 0) {
          return res.json({
            status: true,
            message: "User found",
            data: result,
          });
        } else {
          return res.json({
            status: false,
            message: "No orders found for this user",
            data: [],
          });
        }
      } else {
        result = await mainorder_model.aggregate([
          {
            $match: {
              adminid: userid,
            },
          },
          {
            $lookup: {
              from: "users",
              let: { user_id: { $toObjectId: "$userid" } },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$user_id"] },
                  },
                },
              ],
              as: "userDetails",
            },
          },
          {
            $unwind: {
              path: "$userDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              adminid: 1,
              username: { $ifNull: ["$userDetails.UserName", "No username"] },

              symbol: 1,
              buy_qty: 1,
              sell_qty: 1,
              PositionAvg: 1,
              buy_type: 1,
              sell_type: 1,
              buy_type: 1,
              sell_price: 1,
              buy_lot: 1,
              sell_lot: 1,
              buy_time: 1,
              sell_time: 1,
              lotsize: 1,
              token: 1,
              requiredFund: 1,
              reason: 1,
              status: 1,
              perlot: 1,
              brokerage: 1,
              limit: 1,
              createdAt: 1,
            },
          },
        ]);

        if (result.length > 0) {
          return res.json({
            status: true,
            message: "Admin found",
            data: result,
          });
        } else {
          return res.json({
            status: false,
            message: "No orders found for this admin",
            data: [],
          });
        }
      }
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // position
  async position(req, res) {
    try {
      const { userid } = req.body;

      const today = new Date();
      const startOfDay = today.setHours(0, 0, 0, 0);
      const endOfDay = today.setHours(23, 59, 59, 999);

      // List of crypto tokens
      const cryptoTokens = [
        "usdtusd",
        "btcxrp",
        "btcusd",
        "ethxrp",
        "ethusd",
        "usdcusd",
        "solusd",
        "solbtc",
        "bnbbtc",
        "xrpusd",
        "daiusd",
        "dogeusd",
      ];

      const finduser = await mainorder_model.aggregate([
        {
          $match: {
            userid,
            createdAt: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) },
            $or: [{ buy_type: null }, { sell_type: null }],
          },
        },
        {
          $addFields: {
            Mk_type: {
              $cond: {
                if: { $in: [{ $toLower: "$token" }, cryptoTokens] },
                then: "crypto",
                else: "forex",
              },
            },
          },
        },
        {
          $project: {
            symbol: 1,
            buy_type: 1,
            sell_type: 1,
            buy_lot: 1,
            sell_lot: 1,
            buy_qty: 1,
            sell_qty: 1,
            buy_price: 1,
            sell_price: 1,
            requiredFund: 1,
            lotsize: 1,
            signal_type: 1,
            buy_time: 1,
            sell_time: 1,
            token: 1,
            Mk_type: 1, // Include Mk_type in the response
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      if (!finduser.length) {
        return res.json({
          status: false,
          error: "No positions found",
          data: [],
        });
      }

      console.log("currentPosition", finduser);
      res.json({ status: true, data: finduser });
    } catch (error) {
      console.error("Error fetching positions:", error);
      res.json({ status: false, error: "Internal Server Error", data: [] });
    }
  }

  // holding
  async holding(req, res) {
    try {
      const { userid } = req.body;

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      const cryptoTokens = [
        "usdtusd",
        "btcxrp",
        "btcusd",
        "ethxrp",
        "ethusd",
        "usdcusd",
        "solusd",
        "solbtc",
        "bnbbtc",
        "xrpusd",
        "daiusd",
        "dogeusd",
      ];

      const finduser = await mainorder_model.aggregate([
        {
          $match: {
            userid,
            createdAt: { $lt: startOfDay },
            $or: [{ buy_type: null }, { sell_type: null }],
          },
        },
        {
          $addFields: {
            Mk_type: {
              $cond: {
                if: { $in: [{ $toLower: "$token" }, cryptoTokens] },
                then: "crypto",
                else: "forex",
              },
            },
          },
        },
        {
          $project: {
            symbol: 1,
            buy_type: 1,
            sell_type: 1,
            buy_lot: 1,
            sell_lot: 1,
            buy_qty: 1,
            sell_qty: 1,
            buy_price: 1,
            sell_price: 1,
            requiredFund: 1,
            lotsize: 1,
            signal_type: 1,
            buy_time: 1,
            sell_time: 1,
            token: 1,
            Mk_type: 1, // Include Mk_type in the response
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      if (finduser.length == 0) {
        return res.json({
          status: false,
          error: "No holdings found",
          data: [],
        });
      }

      return res.json({ status: true, data: finduser });
    } catch (error) {
      return res.json({
        status: false,
        error: "Internal Server Error",
        data: [],
      });
    }
  }

  // Switch between buy and sell orders based on the type of order placed by the user
  async switchOrderType(req, res) {
    try {
      const { id } = req.body;

      const order = await mainorder_model.findOne({ _id: id });

      if (!order) {
        return res.json({ status: false, message: "Order not found" });
      }

      // Toggle the signal_type
      order.signal_type =
        order.signal_type === "buy_sell" ? "sell_buy" : "buy_sell";

      const temp = order.buy_price;
      order.buy_price = order.sell_price;
      order.sell_price = temp;

      await order.save();

      const firstHalf = order.orderid.slice(
        0,
        Math.ceil(order.orderid.length / 2)
      );
      const secondHalf = order.orderid.slice(
        Math.ceil(order.orderid.length / 2)
      );

      const balanceStatementData = await BalanceStatement.find({
        orderid: { $in: firstHalf[0] },
      });

      const balanceStatementData1 = await BalanceStatement.find({
        orderid: { $in: secondHalf[0] },
      });

      var PriceUpdate = balanceStatementData[0].Amount;
      var PriceUpdate1 = balanceStatementData1[0].Amount;

      balanceStatementData[0].Amount = PriceUpdate1;
      balanceStatementData1[0].Amount = PriceUpdate;

      await balanceStatementData[0].save();
      await balanceStatementData1[0].save();

      // Return success response with the updated order and matched BalanceStatement data
      return res.json({
        status: true,
        message: "Order type switched",
        order,
        balanceStatements: "",
      });
    } catch (error) {
      console.log("Error:", error);
      return res
        .status(500)
        .json({ status: false, message: "An error occurred", error });
    }
  }

  async UpdateTargetSlPRice(req, res) {
    try {
      const { id, stoploss_price, Target_price } = req.body;

      const order = await mainorder_model.findOne({ _id: id });

      if (!order) {
        return res.json({ status: false, message: "Order not found" });
      }

      order.stoploss_price = stoploss_price;
      order.Target_price = Target_price;

      await order.save();

      return res.json({ status: true, message: "Order updated successfully" });
    } catch (error) {
      console.log("Error:", error);
      return res.json({ status: false, message: "An error occurred", error });
    }
  }

  // squareoff
  async Squareoff(req, res) {
    try {
      const { id, userid, symbol, type, lot, price, qty, requiredFund } =
        req.body;

      // Parse input values as floating-point numbers to handle decimals
      const priceNum = parseFloat(price);
      const lotNum = parseFloat(lot);
      const qtyNum = parseFloat(qty);

      // Fetch trade history and user details
      const tradehistory = await mainorder_model.findOne({ _id: id });
      const checkadmin = await User_model.findOne({ _id: userid });

      if (!tradehistory) {
        return res.json({
          status: false,
          message: "Trade Not Found",
          data: [],
        });
      }

      if (!checkadmin) {
        return res.json({
          status: false,
          message: "User Not Found",
          data: [],
        });
      }

      // Calculate brokerage
      let brokerage = 0;
      if (checkadmin.pertrade) {
        brokerage = parseFloat(checkadmin.pertrade);
      } else if (checkadmin.perlot) {
        // brokerage = parseFloat(checkadmin.perlot) * lotNum;
        brokerage = 0;
      }
      let totalQty = 0;
      let RemainingQty = 0;
      if (type === "buy") {
        totalQty = (tradehistory.buy_lot || 0) + lotNum;
        RemainingQty = tradehistory.sell_lot - totalQty;
      } else {
        totalQty = (tradehistory.sell_lot || 0) + lotNum;
        RemainingQty = tradehistory.buy_lot - totalQty;
      }

      if (RemainingQty == 0 && checkadmin.pertrade) {
        brokerage = 0;
      }

      // Validate lot size based on type (buy or sell)
      if (
        type === "buy" &&
        (tradehistory.buy_lot || 0) + lotNum > tradehistory.sell_lot
      ) {
        return res.json({
          status: false,
          message: "The lot size is greater than allowed",
          data: [],
        });
      } else if (
        type === "sell" &&
        (tradehistory.sell_lot || 0) + lotNum > tradehistory.buy_lot
      ) {
        return res.json({
          status: false,
          message: "The lot size is greater than allowed",
          data: [],
        });
      }

      let Calculatefund = priceNum * qtyNum;
      let Profitloss;

      if (tradehistory.signal_type === "buy_sell") {
        Profitloss = priceNum * qtyNum - tradehistory.buy_price * qtyNum;
      } else {
        Profitloss = tradehistory.sell_price * qtyNum - priceNum * qtyNum;
      }

      console.log("sq Profitloss--", Profitloss);

      let Totalupdateuserbalance = Profitloss - brokerage;

      console.log("sq Totalupdateuserbalance--", Totalupdateuserbalance);

      let totaladdbalance =
        parseFloat(tradehistory?.totalamount || 1) * qtyNum +
        parseFloat(checkadmin.Balance) +
        Totalupdateuserbalance;

      const totalamountCal =
        parseFloat(tradehistory?.totalamount || 1) * qty +
        parseFloat(Totalupdateuserbalance);

      // Create a new order entry
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
        brokerage: brokerage,
        totalamount: totalamountCal,
        limit: checkadmin.limit,
        requiredFund: totalamountCal,
        type,
        status: "Completed",
      });

      const orderdata = await newOrder.save();

      // Update trade history with the new order ID
      if (Array.isArray(tradehistory.orderid)) {
        tradehistory.orderid.push(orderdata._id);
      } else {
        tradehistory.orderid = [orderdata._id];
      }

      // Update trade history and user balance based on the type (buy or sell)
      if (type === "buy") {
        const totalQuantity = (tradehistory.buy_lot || 0) + lotNum;

        const totalCost =
          (tradehistory.buy_price * tradehistory.buy_lot || 0) +
          priceNum * lotNum;
        const avgPrice = totalCost / totalQuantity;

        tradehistory.buy_price = avgPrice;
        tradehistory.buy_lot = totalQuantity;
        tradehistory.buy_qty = (tradehistory.buy_qty || 0) + qtyNum;
        tradehistory.buy_type = type;
        tradehistory.buy_time = new Date();
        tradehistory.profitloss = Profitloss;

        await tradehistory.save();
      } else if (type === "sell") {
        const totalQuantity = (tradehistory.sell_lot || 0) + lotNum;
        const totalCost =
          (tradehistory.sell_price * tradehistory.sell_lot || 0) +
          priceNum * lotNum;
        const avgPrice = totalCost / totalQuantity;

        tradehistory.sell_price = avgPrice;
        tradehistory.sell_lot = totalQuantity;
        tradehistory.sell_qty = (tradehistory.sell_qty || 0) + qtyNum;
        tradehistory.sell_type = type;
        tradehistory.sell_time = new Date();
        tradehistory.profitloss = Profitloss;

        await tradehistory.save();
      }

      // Update user balance in the database
      await User_model.updateOne(
        { _id: checkadmin._id },
        { $set: { Balance: totaladdbalance } }
      );

      // Create a new balance statement
      const newstatement = new BalanceStatement({
        userid: userid,
        orderid: orderdata._id,
        Amount: Calculatefund,
        type: "CREDIT",
        message: "Balance used to sell",
        symbol: symbol,
        brokerage: brokerage,
      });

      await newstatement.save();

      return res.json({
        status: true,
        message: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } order updated successfully`,
        data: [],
      });
    } catch (error) {
      console.error("Error:", error);
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  // placeorder
  async placeorder(req, res) {
    try {
      const {
        userid,
        symbol,
        price,
        lot,
        qty,
        requiredFund,
        token,
        type,
        lotsize,
      } = req.body;

      const checkadmin = await User_model.findOne({
        _id: userid,
        Role: "USER",
      });

      if (!checkadmin) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      const SymbolToken = await Symbol.findOne({ symbol: symbol });
      if (SymbolToken == null) {
        return res.json({
          status: false,
          message: "Symbol not found",
          order: [],
        });
      }

      let brokerage = 0;
      if (checkadmin.pertrade) {
        brokerage = parseFloat(checkadmin.pertrade);
      } else if (checkadmin.perlot) {
        brokerage = parseFloat(checkadmin.perlot) * parseFloat(lot);
      }

      const checkbalance = checkadmin.Balance;

      const totalamount =
        parseFloat(requiredFund) / parseFloat(checkadmin.limit);

      let brokerageFund = totalamount + brokerage + brokerage;

      if (parseFloat(checkbalance) < parseFloat(brokerageFund)) {
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
          lotsize,
          status: "rejected",
          reason: "Order rejected due to low Balance",
        });

        await rejectedOrder.save();

        return res.json({
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
        totalamount: totalamount + brokerage + brokerage,
        adminid: checkadmin.parent_id,
        pertrade: checkadmin.userdata,
        perlot: checkadmin.perlot,
        turn_over_percentage: checkadmin.turn_over_percentage,
        brokerage: brokerage,
        limit: checkadmin.limit,
        requiredFund,
        token: SymbolToken?.token,
        type,
        lotsize: lotsize,
        status: "Completed",
      });

      // Save the new order to the database
      const orderdata = await newOrder.save();

      // Call appropriate trade function based on order type
      if (type === "buy") {
        await EntryTrade(
          req,
          res,
          orderdata,
          checkadmin,
          SymbolToken,
          brokerage,
          totalamount
        );
      } else if (type === "sell") {
        await ExitTrade(
          req,
          res,
          orderdata,
          checkadmin,
          SymbolToken,
          brokerage,
          totalamount
        );
      } else {
        return res.json({ status: false, message: "Invalid request" });
      }
    } catch (error) {
      res.json({
        status: false,
        message: "internal error",
        error: error.message,
      });
    }
  }
}

// place order entry trade
const EntryTrade = async (
  req,
  res,
  orderdata,
  checkadmin,
  SymbolToken,
  brokerage,
  totalamount
) => {
  try {
    const { userid, symbol, price, lot, qty, requiredFund, lotsize, type } =
      req.body;

    const priceNum = parseFloat(price);
    const lotNum = parseFloat(lot, 10);
    const qtyNum = parseFloat(qty, 10);
    const requiredFundNum = parseFloat(requiredFund);

    const currentTime = new Date();

    let tradehistory = await mainorder_model.findOne({
      userid,
      symbol,
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    const limitclaculation =
      parseFloat(requiredFund) / parseFloat(checkadmin.limit);

    const updateuserbalance =
      parseFloat(checkadmin.Balance) - parseFloat(limitclaculation);

    const Totalupdateuserbalance =
      parseFloat(updateuserbalance) - parseFloat(brokerage) * 2;

    console.log("limitclaculation", limitclaculation);

    console.log("lot - ", qty);
    let ActualFun = limitclaculation;
    if (qty > 1) {
      ActualFun = limitclaculation / qty;
    }
    console.log("ActualFun - ", ActualFun);
    const seventyPercent = (ActualFun * 70) / 100;

    console.log("seventyPercent - ", seventyPercent);
    console.log("price - ", price);

    console.log(
      "price - seventyPercent",
      parseFloat(price) - parseFloat(seventyPercent)
    );

    tradehistory = new mainorder_model({
      orderid: orderdata._id,
      userid,
      symbol,
      buy_type: type,
      buy_price: price,
      buy_lot: lot,
      buy_qty: qty,
      buy_time: currentTime,
      requiredFund,
      lotsize: lotsize,
      token: SymbolToken.token,
      adminid: checkadmin.parent_id,
      pertrade: checkadmin.userdata,
      perlot: checkadmin.perlot,
      turn_over_percentage: checkadmin.turn_over_percentage,
      brokerage: brokerage,
      limit: checkadmin.limit,
      status: "Completed",
      createdAt: currentTime,
      signal_type: "buy_sell",
      totalamount: totalamount / qtyNum,
      Sl_price_percentage: parseFloat(price) - parseFloat(seventyPercent),
    });

    await tradehistory.save();

    await User_model.updateOne(
      { _id: checkadmin._id },
      { $set: { Balance: Totalupdateuserbalance } }
    );

    let newstatement = new BalanceStatement({
      userid: userid,
      orderid: orderdata._id,
      Amount: -(priceNum * qtyNum),
      type: "DEBIT",
      message: "Balanced used to buy",
      symbol: symbol,
      brokerage: brokerage + brokerage,
    });
    await newstatement.save();

    return res.json({
      status: true,
      message: "Order placed",
    });
  } catch (error) {
    console.error("Error processing buy order:", error);
    return res.json({ status: false, message: "internal error", data: [] });
  }
};

// Exit trade
const ExitTrade = async (
  req,
  res,
  orderdata,
  checkadmin,
  SymbolToken,
  brokerage,
  totalamount
) => {
  const { userid, symbol, price, type, lot, qty, lotsize, requiredFund } =
    req.body;

  const priceNum = parseFloat(price);
  const qtyNum = parseFloat(qty, 10);

  const currentTime = new Date();

  try {
    let tradehistory = await mainorder_model.findOne({
      userid,
      symbol,
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    const checkbalance = checkadmin.Balance * checkadmin.limit;

    if (checkbalance < requiredFund) {
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
        lotsize,
        status: "rejected",
        reason: "Order rejected due to low Balance",
      });

      // Save the rejected order and return a response
      await rejectedOrder.save();

      return res.json({
        status: false,
        message: "Order rejected due to low Balance",
        order: rejectedOrder,
      });
    }

    const limitclaculation =
      parseFloat(requiredFund) / parseFloat(checkadmin.limit);
    const updateuserbalance =
      parseFloat(checkadmin.Balance) - parseFloat(limitclaculation);

    const Totalupdateuserbalance =
      parseFloat(updateuserbalance) - parseFloat(brokerage) * 2;

    console.log("limitclaculation", limitclaculation);

    console.log("lot - ", qty);
    let ActualFun = limitclaculation;
    if (qty > 1) {
      ActualFun = limitclaculation / qty;
    }
    console.log("ActualFun - ", ActualFun);
    const seventyPercent = (ActualFun * 70) / 100;

    console.log("seventyPercent - ", seventyPercent);
    console.log("price - ", price);

    console.log(
      "sell price - seventyPercent",
      parseFloat(price) + parseFloat(seventyPercent)
    );

    tradehistory = new mainorder_model({
      orderid: orderdata._id,
      userid,
      symbol,
      sell_type: type,
      sell_price: price,
      sell_lot: lot,
      sell_qty: qty,
      sell_time: currentTime,
      requiredFund,
      lotsize: lotsize,
      token: SymbolToken.token,
      adminid: checkadmin.parent_id,
      pertrade: checkadmin.userdata,
      perlot: checkadmin.perlot,
      turn_over_percentage: checkadmin.turn_over_percentage,
      brokerage: brokerage,
      limit: checkadmin.limit,
      status: "Completed",
      createdAt: currentTime,
      signal_type: "sell_buy",
      totalamount: totalamount / qty,
      Sl_price_percentage: parseFloat(price) + parseFloat(seventyPercent),
    });

    await tradehistory.save();

    await User_model.updateOne(
      { _id: checkadmin._id },
      { $set: { Balance: Totalupdateuserbalance } }
    );

    let newstatement = new BalanceStatement({
      userid: userid,
      orderid: orderdata._id,
      Amount: -(priceNum * qtyNum),
      type: "DEBIT",
      message: "Balanced used to buy",
      symbol: symbol,
      brokerage: brokerage + brokerage,
    });
    await newstatement.save();

    return res.json({
      status: true,
      message: "Order placed",
    });
  } catch (error) {
    console.error("Error processing sell order:", error);
    return res.json({
      status: false,
      message: "An error occurred while processing the sell order",
    });
  }
};

module.exports = new Placeorder();
