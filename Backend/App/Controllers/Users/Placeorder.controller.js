"use strict";

const db = require("../../Models");
const Symbol = db.Symbol;
const Order = db.Order;
const User_model = db.user;
const mainorder_model = db.mainorder_model;
const BalanceStatement = db.BalanceStatement;
const tradeSwitchlogs = db.tradeSwitchlogs;
const mongoose = require("mongoose");
const moment = require("moment"); // make sure to install it

class Placeorder {
  async getLedgerReport(req, res) {
    try {
      const { userid, filter = "all" } = req.body;

      // Calculate the starting date based on filter
      let startDate;

      const now = new Date();

      switch (filter) {
        case "1w":
          startDate = moment(now).subtract(1, "weeks").toDate();
          break;
        case "1m":
          startDate = moment(now).subtract(1, "months").toDate();
          break;
        case "6m":
          startDate = moment(now).subtract(6, "months").toDate();
          break;
        case "1y":
          startDate = moment(now).subtract(1, "years").toDate();
          break;
        default:
          startDate = null; // means no filter
      }

      // Build query
      const query = { userid };
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }

      const GetBalanceStatement = await BalanceStatement.find(query)
        .select("Amount type message symbol brokerage Exittype createdAt")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        message: "Ledger report fetched successfully",
        data: GetBalanceStatement,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  // get order book
  async getOrderBook(req, res) {
    try {
      const { userid, fromDate, toDate } = req.body;

      const query = { userid };

      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setDate(to.getDate() + 1);

        query.createdAt = {
          $gte: from,
          $lt: to,
        };
      } else {
        // Default: today's orders
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        query.createdAt = {
          $gte: startOfToday,
          $lte: endOfToday,
        };
      }

      const result = await Order.find(query).sort({ createdAt: -1 });

      if (!result.length) {
        return res.json({
          status: false,
          message: "No orders found for this user",
          data: [],
        });
      }

      // Format output
      const formattedResult = result.map((order) => ({
        ...order.toObject(),
        price: order.price || null,
        totalamount: order.totalamount || null,
        requiredFund: order.requiredFund || null,
      }));

      return res.json({
        status: true,
        message: "Orders found",
        data: formattedResult,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  // async gettardehistory(req, res) {
  //   try {
  //     const { userid, Role } = req.body;

  //     let result;

  //     if (Role === "USER") {
  //       result = await mainorder_model
  //         .find({ userid: userid })
  //         .sort({ createdAt: -1 });
  //       if (result.length > 0) {
  //         return res.json({
  //           status: true,
  //           message: "User found",
  //           data: result,
  //         });
  //       } else {
  //         return res.json({
  //           status: false,
  //           message: "No orders found for this user",
  //           data: [],
  //         });
  //       }
  //     } else {
  //       result = await mainorder_model.aggregate([
  //         {
  //           $match: {
  //             adminid: userid,
  //             $or: [
  //               { sell_price: null },
  //               { sell_price: { $exists: false } }
  //             ]
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "users",
  //             let: { user_id: { $toObjectId: "$userid" } },
  //             pipeline: [
  //               {
  //                 $match: {
  //                   $expr: { $eq: ["$_id", "$$user_id"] },
  //                 },
  //               },
  //             ],
  //             as: "userDetails",
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: "$userDetails",
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //         {
  //           $project: {
  //             adminid: 1,
  //             username: { $ifNull: ["$userDetails.UserName", "No username"] },

  //             symbol: 1,
  //             buy_qty: 1,
  //             sell_qty: 1,
  //             PositionAvg: 1,
  //             buy_type: 1,
  //             sell_type: 1,
  //             buy_type: 1,
  //             sell_price: 1,
  //             buy_lot: 1,
  //             buy_price: 1,
  //             sell_lot: 1,
  //             buy_time: 1,
  //             sell_time: 1,
  //             lotsize: 1,
  //             token: 1,
  //             requiredFund: 1,
  //             reason: 1,
  //             status: 1,
  //             perlot: 1,
  //             brokerage: 1,
  //             limit: 1,
  //             createdAt: 1,
  //           },

  //         },
  //       ]);

  //       if (result.length > 0) {
  //         return res.json({
  //           status: true,
  //           message: "Admin found",
  //           data: result,
  //         });
  //       } else {
  //         return res.json({
  //           status: false,
  //           message: "No orders found for this admin",
  //           data: [],
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     return res.json({ status: false, message: "Internal error", data: [] });
  //   }
  // }


  async gettardehistory(req, res) {
    try {
      const { userid, Role } = req.body;
      let result;

      if (Role === "USER") {
        // USER case — pura data
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
        // ADMIN case — pura data with user details
        result = await mainorder_model.aggregate([
          {
            $match: {
              adminid: userid,
              $or: [
                { sell_price: null },
                { sell_price: { $exists: false } }
              ]
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
            $addFields: {
              username: { $ifNull: ["$userDetails.UserName", "No username"] }
            }
          }
          // $project hata diya, taaki sara data aaye
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
      console.error(error);
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
        "bnbbtc",
        "btcusd",
        "dogeusd",
        "ethusd",
        "solbtc",
        "solusd",
        "usdtusd",
        "xrpusd",
        "adausd",
        "bchusd",
        "suiusd",
        "linkusd",
        "xlmusd",
        "shibusd",
        "ltcusd",
        "hbarusd",
        "dotusd",
        "uniusd",
        "pepeusd",
        "aaveusd",
        "taousd",
        "aptusd",
        "icpusd",
        "nearusd",
        "etcusd",
        "ondousd",
        "usd1usd",
        "gtusd",
        "mntusd",
        "polusd",
        "vetusd",
        "kasusd",
        "trumpusd",
        "enausd",
        "skyusd",
        "renderusd",
        "fetusd",
        "filusd",
        "daiusd",
        "usdcusd",
        "avaxusd",
        "bnbusd",
        "trxusd",
        "hypeusd",
        "leousd",
        "xmrusd",
        "usdeusd",
        "bgbusd",
        "piusd",
        "okbusd",
        "croususd",
      ];

      const finduser = await mainorder_model.aggregate([
        {
          $match: {
            userid,
            Converted: "INTRADAY",
            createdAt: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) },
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
          $lookup: {
            from: "live_prices",
            localField: "token",
            foreignField: "ticker",
            as: "live_pricesdt",
          },
        },
        { $unwind: "$live_pricesdt" },
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
            Target_price: 1,
            stoploss_price: 1,
            Mk_type: 1,
            Exittype: 1,
            lastpricedt: "$live_pricesdt.lastprice",
            liveprice: "$live_pricesdt.Mid_Price",
            Converted: 1
          },
        },
      ]);

      if (!finduser.length) {
        return res.json({
          status: false,
          error: "No positions found",
          data: [],
        });
      }

      let PositionData = finduser.map((data) => {
        return {
          ...data,
          buy_price:
            data?.buy_price && !isNaN(data.buy_price)
              ? data.buy_price.toFixed(4)
              : null,
          sell_price:
            data?.sell_price && !isNaN(data.sell_price)
              ? data.sell_price.toFixed(4)
              : null,
        };
      });

      PositionData.sort((a, b) => {
        const aHasBoth = a.buy_type !== null && a.sell_type !== null;
        const bHasBoth = b.buy_type !== null && b.sell_type !== null;

        return aHasBoth - bHasBoth;
      });

      res.json({ status: true, data: PositionData });
    } catch (error) {
      res.json({ status: false, error: "Internal Server Error", data: [] });
    }
  }

  // holding
  async holding(req, res) {
    try {
      const { userid } = req.body;

      // const today = new Date();
      // const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      const cryptoTokens = [
        "bnbbtc",
        "btcusd",
        "dogeusd",
        "ethusd",
        "solbtc",
        "solusd",
        "usdtusd",
        "xrpusd",
        "adausd",
        "bchusd",
        "suiusd",
        "linkusd",
        "xlmusd",
        "shibusd",
        "ltcusd",
        "hbarusd",
        "dotusd",
        "uniusd",
        "pepeusd",
        "aaveusd",
        "taousd",
        "aptusd",
        "icpusd",
        "nearusd",
        "etcusd",
        "ondousd",
        "usd1usd",
        "gtusd",
        "mntusd",
        "polusd",
        "vetusd",
        "kasusd",
        "trumpusd",
        "enausd",
        "skyusd",
        "renderusd",
        "fetusd",
        "filusd",
        "daiusd",
        "usdcusd",
        "avaxusd",
        "bnbusd",
        "trxusd",
        "hypeusd",
        "leousd",
        "xmrusd",
        "usdeusd",
        "bgbusd",
        "piusd",
        "okbusd",
        "croususd",
      ];

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const HoldingData = await mainorder_model.aggregate([
        {
          $match: {
            userid: userid,
            $or: [
              {
                $and: [
                  { createdAt: { $lt: startOfDay } },
                  { $expr: { $ne: ["$buy_qty", "$sell_qty"] } },
                ],
              },
              {
                $expr: {
                  $eq: [
                    {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$holding_dtime",
                      },
                    },
                    {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: new Date(),
                      },
                    },
                  ],
                },
              },
              {
                $and: [
                  { Converted: "HOLDING" },
                  {
                    createdAt: {
                      $gte: startOfDay,
                      $lte: endOfDay,
                    },
                  },
                  {
                    $expr: { $ne: ["$buy_qty", "$sell_qty"] },
                  },
                ],
              },
            ],
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
          $lookup: {
            from: "live_prices",
            localField: "token",
            foreignField: "ticker",
            as: "live_pricesdt",
          },
        },
        { $unwind: "$live_pricesdt" },
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
            Target_price: 1,
            stoploss_price: 1,
            Mk_type: 1,
            Exittype: 1,
            lastpricedt: "$live_pricesdt.lastprice",
            liveprice: "$live_pricesdt.Mid_Price",
            Converted: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      if (HoldingData.length == 0) {
        return res.json({
          status: false,
          error: "No holdings found",
          data: [],
        });
      }

      return res.json({ status: true, data: HoldingData });
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
      const trade = await mainorder_model.findOne({ _id: id });
      if (!trade) {
        return res.json({ status: false, message: "Order not found" });
      }

      const isDoubleOrder = trade.orderid.length === 2;
      // Swap helpers
      const swap = (a, b) => [b, a];
      const isBuySell = trade.signal_type === "buy_sell";

      if (isDoubleOrder) {
        trade.signal_type = isBuySell ? "sell_buy" : "buy_sell";
        [trade.buy_price, trade.sell_price] = swap(
          trade.buy_price,
          trade.sell_price
        );
        [trade.buy_time, trade.sell_time] = swap(
          trade.buy_time,
          trade.sell_time
        );
        await trade.save();

        let [order1, order2] = await Order.find({
          _id: { $in: trade.orderid },
        }).sort({ createdAt: 1 });
        [order1.createdAt, order2.createdAt] = swap(
          order1.createdAt,
          order2.createdAt
        );
        await Promise.all([order1.save(), order2.save()]);

        let [bs1, bs2] = await BalanceStatement.find({
          orderid: { $in: trade.orderid },
        }).sort({ createdAt: 1 });
        const tempAmt = bs1.Amount;
        bs1.Amount = -bs2.Amount;
        bs2.Amount = Math.abs(tempAmt);

        bs1.orderid = Array.isArray(bs1.orderid)
          ? [...bs1.orderid, order2._id]
          : [order2._id];
        bs2.orderid = Array.isArray(bs2.orderid)
          ? [...bs2.orderid, order1._id]
          : [order1._id];

        await Promise.all([bs1.save(), bs2.save()]);
      } else {
        trade.signal_type = isBuySell ? "sell_buy" : "buy_sell";

        if (isBuySell) {
          let DifrencePrice =
            trade.buy_price - parseFloat(trade.Sl_price_percentage);

          trade.Sl_price_percentage = trade.buy_price + DifrencePrice;

          trade.sell_price = trade.buy_price;
          trade.buy_price = null;

          trade.sell_time = trade.buy_time;
          trade.buy_time = null;

          trade.sell_qty = trade.buy_qty;
          trade.buy_qty = null;

          trade.sell_lot = trade.buy_lot;
          trade.buy_lot = null;

          trade.sell_type = trade.buy_type;
          trade.buy_type = null;
        } else {
          let DifrencePrice =
            parseFloat(trade.Sl_price_percentage) - trade.sell_price;

          trade.Sl_price_percentage = trade.sell_price - DifrencePrice;

          trade.buy_price = trade.sell_price;
          trade.sell_price = null;

          trade.buy_time = trade.sell_time;
          trade.sell_time = null;

          trade.buy_qty = trade.sell_qty;
          trade.sell_qty = null;

          trade.buy_lot = trade.sell_lot;
          trade.sell_lot = null;

          trade.buy_type = trade.sell_type;
          trade.sell_type = null;
        }

        await trade.save();

        const order = await Order.findOne({ _id: { $in: trade.orderid } }).sort(
          { createdAt: 1 }
        );
        order.type = isBuySell ? "sell" : "buy";
        await order.save();
      }



      const tradelogs = await tradeSwitchlogs({
        user_Id: trade.userid || "",
        admin_Id: trade.adminid || "",
        Symbol: trade.symbol || "",
        Trade_Id: id,
        type: trade.signal_type,
        message: `Order type switched to ${trade.signal_type}`,
      });

      await tradelogs.save()

      return res.json({
        status: true,
        message: "Order type switched",
        TradeHistoryData: trade,
        balanceStatements: "",
      });
    } catch (error) {
      console.error("Switch order type error:", error);
      return res.status(500).json({
        status: false,
        message: "An error occurred",
        error: error.message || error,
      });
    }
  }


  async getSwitchOrderType(req, res) {
    try {
      const { admin_id } = req.body;

      const logs = await tradeSwitchlogs.aggregate([
        {
          $match: {
            admin_Id: new mongoose.Types.ObjectId(admin_id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_Id",
            foreignField: "_id",
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
            _id: 1,
            Symbol: 1,
            type: 1,
            Trade_Id: 1,
            admin_Id: 1,
            user_Id: 1,
            message: 1,
            createdAt: 1,
            updatedAt: 1,
            UserName: "$userDetails.UserName",
          },
        },
      ]);

      res.status(200).json({
        status: true,
        message: "Logs fetched successfully",
        data: logs,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Server Error",
        error: error.message,
      });
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
      return res.json({ status: false, message: "An error occurred", error });
    }
  }

  async GetModifyOrder(req, res) {
    try {
      const { id } = req.body;

      const GetModifyOrder = await mainorder_model.findOne({ _id: id });

      if (!GetModifyOrder) {
        return res.json({ status: false, message: "Order not found" });
      }

      return res.json({
        status: true,
        message: "Order found",
        data: GetModifyOrder,
      });
    } catch (error) {
      return res.json({ status: false, message: "An error occurred", error });
    }
  }

  // squareoff
  async Squareoff(req, res) {
    try {
      const {
        id,
        userid,
        symbol,
        type,
        lot,
        price,
        qty,
        requiredFund,
        Exittype,
      } = req.body;

      // if price 0 null undefined empty then return error please provide price
      if (!price || price <= 0) {
        return res.json({ status: false, message: "Please provide price" });
      }

      // Parse input values as floating-point numbers to handle decimals
      const priceNum = parseFloat(price);
      const lotNum = parseFloat(lot);
      const qtyNum = parseFloat(qty);

      let ExittypeData = Exittype ?? "SQUAREOFF";

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

      if (checkadmin.transactionwise) {
        brokerage =
          (parseFloat(checkadmin.transactionwise) * parseFloat(requiredFund)) /
          100;
        brokerage = parseFloat(brokerage.toFixed(2));
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

      let Totalupdateuserbalance = Profitloss - brokerage;

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
        limit: tradehistory?.With_Margin == false ? 1 : checkadmin.limit,
        requiredFund: totalamountCal,
        type,
        status: "Completed",
        Exittype: ExittypeData,
      });

      const orderdata = await newOrder.save();

      if (Array.isArray(tradehistory.orderid)) {
        tradehistory.orderid.push(orderdata._id);
      } else {
        tradehistory.orderid = [orderdata._id];
      }

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
        tradehistory.Exittype = ExittypeData;

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
        tradehistory.Exittype = ExittypeData;

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
        Exittype: ExittypeData,
      });

      await newstatement.save();

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      const tradehistorydata = await mainorder_model.findOne({ _id: id });

      if (tradehistorydata.createdAt > startOfDay) {
      } else {
        tradehistorydata.holding_dtime = new Date();

        await tradehistorydata.save();
      }

      return res.json({
        status: true,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)
          } order updated successfully`,
        data: [],
      });
    } catch (error) {
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
        With_Margin,
        selectedOption,
        limitstopprice,
      } = req.body;

      if (price <= 0 || !price) {
        return res.json({ status: false, message: "Please provide price" });
      }

      if (price == undefined || price == null || price == "") {
        return res.json({ status: false, message: "Please provide price" });
      }

      const checkadmin = await User_model.findOne({
        _id: userid,
        Role: "USER",
      });

      if (!checkadmin) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      let NewLimit = With_Margin ? parseFloat(checkadmin.limit) : 1;

      const SymbolToken = await Symbol.findOne({ symbol: symbol });
      if (SymbolToken == null) {
        return res.json({
          status: false,
          message: "Symbol not found",
          order: [],
        });
      }
      const checkbalance = checkadmin.Balance;

      let brokerage = 0;
      if (checkadmin.pertrade) {
        brokerage = parseFloat(checkadmin.pertrade);
      } else if (checkadmin.perlot) {
        brokerage = parseFloat(checkadmin.perlot) * parseFloat(lot);
      } else if (checkadmin.transactionwise) {
        brokerage =
          (parseFloat(checkadmin.transactionwise) * parseFloat(requiredFund)) /
          100;

        brokerage = brokerage.toFixed(2);
      }

      const totalamount = parseFloat(requiredFund) / NewLimit;

      let brokerageFund = parseFloat(totalamount) + parseFloat(brokerage);

      if (checkadmin.transactionwise == null) {
        brokerageFund = brokerageFund + parseFloat(brokerage);
      }

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
          selectedOption,
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

      if (selectedOption == "Limit" || selectedOption == "Stop") {
        const newOrder = new Order({
          userid,
          symbol,
          price,
          lot,
          qty,
          totalamount:
            checkadmin.transactionwise == null
              ? totalamount + parseFloat(brokerage) + parseFloat(brokerage)
              : totalamount + parseFloat(brokerage),
          adminid: checkadmin.parent_id,
          pertrade: checkadmin.userdata,
          perlot: checkadmin.perlot,
          turn_over_percentage: checkadmin.turn_over_percentage,
          brokerage: brokerage,
          limit: NewLimit,
          requiredFund,
          token: SymbolToken?.token,
          type,
          lotsize: lotsize,
          status: "Pending",
          selectedOption,
        });

        // Save the new order to the database
        const orderdata = await newOrder.save();
        return res.json({
          status: true,
          message: "Order placed",
          order: orderdata,
        });
      }

      // Create a new order object
      const newOrder = new Order({
        userid,
        symbol,
        price,
        lot,
        qty,
        totalamount:
          checkadmin.transactionwise == null
            ? totalamount + parseFloat(brokerage) + parseFloat(brokerage)
            : totalamount + parseFloat(brokerage),
        adminid: checkadmin.parent_id,
        pertrade: checkadmin.userdata,
        perlot: checkadmin.perlot,
        turn_over_percentage: checkadmin.turn_over_percentage,
        brokerage: brokerage,
        limit: NewLimit,
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
          totalamount,
          With_Margin,
          NewLimit
        );
      } else if (type === "sell") {
        await ExitTrade(
          req,
          res,
          orderdata,
          checkadmin,
          SymbolToken,
          brokerage,
          totalamount,
          With_Margin,
          NewLimit
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

  async ConvertPosition(req, res) {
    try {
      const { id, user_id } = req.body;

      const UserInfo = await User_model.findOne({ _id: user_id });
      if (!UserInfo) {
        return res.json({ status: false, message: "User not found" });
      }

      const OpenOrders = await Order.find({
        userid: user_id,
        status: "Pending",
      }).select("totalamount");

      const TotalOpenOrderAmount = OpenOrders.reduce(
        (acc, order) => acc + (order?.totalamount || 0),
        0
      );

      const UserBalance = (UserInfo?.Balance || 0) + TotalOpenOrderAmount;

      const trade = await mainorder_model.findOne({ _id: id });
      if (!trade) {
        return res.json({ status: false, message: "Trade not found" });
      }

      let tradeType = trade.signal_type;
      let RequiredFund;
      let totalamount;

      if (tradeType === "buy_sell") {
        RequiredFund =
          (trade?.buy_price * trade?.lotsize) / UserInfo.holding_limit;
        totalamount = trade?.buy_price / UserInfo.holding_limit;
      } else {
        RequiredFund =
          (trade?.sell_price * trade?.lotsize) / UserInfo.holding_limit;
        totalamount = trade?.sell_price / UserInfo.holding_limit;
      }

      const OldRequiredFund = trade.totalamount * trade.lotsize;
      const RequiredFundDiff = RequiredFund - OldRequiredFund;

      if (UserBalance < RequiredFundDiff) {
        return res.json({
          status: false,
          message: "Insufficient balance to convert position",
        });
      }

      // Fetch specific order (should be findOne, not find)
      const order = await Order.findOne({ _id: trade?.orderid[0] });
      if (!order) {
        return res.json({ status: false, message: "Related order not found" });
      }

      // Update mainorder
      trade.totalamount = totalamount;
      trade.limit = UserInfo?.holding_limit;
      trade.Converted = "HOLDING";
      await trade.save();

      // Update order
      order.totalamount = RequiredFund;
      order.limit = UserInfo?.holding_limit;
      await order.save();

      UserInfo.Balance -= RequiredFundDiff;
      await UserInfo.save();


      return res.json({
        status: true,
        message: "Position converted successfully",
      });
    } catch (error) {
      console.error("Convert position error:", error);
      return res.json({
        status: false,
        message: "An error occurred",
        error: error.message || error,
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
  totalamount,
  With_Margin,
  NewLimit
) => {
  try {
    const { userid, symbol, price, lot, qty, requiredFund, lotsize, type } =
      req.body;

    const priceNum = parseFloat(price);
    const qtyNum = parseFloat(qty, 10);

    const limitclaculation = parseFloat(requiredFund) / NewLimit;

    let ActualFun = limitclaculation / qty;

    const EathyPercent = ActualFun * 0.8;

    let multypl = 2;
    if (checkadmin.transactionwise == null) {
      multypl = 2;
    } else {
      multypl = 1;
    }

    let tradehistory = await mainorder_model.findOne({
      userid,
      symbol,
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    const currentTime = new Date();

    const updateuserbalance =
      parseFloat(checkadmin.Balance) - parseFloat(limitclaculation);

    const Totalupdateuserbalance =
      parseFloat(updateuserbalance) - parseFloat(brokerage) * multypl;

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
      limit: NewLimit,
      status: "Completed",
      createdAt: currentTime,
      signal_type: "buy_sell",
      totalamount: totalamount / qtyNum,
      Sl_price_percentage: parseFloat(price) - parseFloat(EathyPercent),
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
      brokerage:
        checkadmin.transactionwise == null
          ? parseFloat(brokerage) + parseFloat(brokerage)
          : parseFloat(brokerage),
    });
    await newstatement.save();

    return res.json({
      status: true,
      message: "Order placed",
    });
  } catch (error) {
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
  totalamount,
  With_Margin,
  NewLimit
) => {
  const { userid, symbol, price, type, lot, qty, lotsize, requiredFund } =
    req.body;

  const priceNum = parseFloat(price);
  const qtyNum = parseFloat(qty, 10);

  const currentTime = new Date();
  const limitclaculation = parseFloat(requiredFund) / NewLimit;

  let ActualFun = limitclaculation / qty;

  const EathyPercent = ActualFun * 0.8;

  let multypl = 2;
  if (checkadmin.transactionwise == null) {
    multypl = 2;
  } else {
    multypl = 1;
  }

  try {
    let tradehistory = await mainorder_model.findOne({
      userid,
      symbol,
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    const checkbalance = checkadmin.Balance * NewLimit;

    const updateuserbalance =
      parseFloat(checkadmin.Balance) - parseFloat(limitclaculation);

    const Totalupdateuserbalance =
      parseFloat(updateuserbalance) - parseFloat(brokerage) * multypl;

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
      limit: NewLimit,
      status: "Completed",
      createdAt: currentTime,
      signal_type: "sell_buy",
      totalamount: totalamount / qty,
      Sl_price_percentage: parseFloat(price) + parseFloat(EathyPercent),
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
      brokerage:
        checkadmin.transactionwise == null
          ? parseFloat(brokerage) + parseFloat(brokerage)
          : parseFloat(brokerage),
    });
    await newstatement.save();

    return res.json({
      status: true,
      message: "Order placed",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "An error occurred while processing the sell order",
    });
  }
};

module.exports = new Placeorder();
