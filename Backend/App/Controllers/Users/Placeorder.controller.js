"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const { findOne } = require("../../Models/Role.model");
const Symbol = db.Symbol;
const Order = db.Order;
const User_model = db.user;
const mainorder_model = db.mainorder_model;
const BalanceStatement = db.BalanceStatement;
const MarginRequired = db.MarginRequired




class Placeorder {


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
      console.error("Error fetching order book:", error);
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
              adminid: userid // Convert the string userid to ObjectId for matching
            }
          },
          {
            $lookup: {
              from: 'users', // 'users' is the collection name where User_model is stored
              let: { user_id: { $toObjectId: "$userid" } }, // Convert the string userid to ObjectId
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$user_id"] } // Match the ObjectId with the converted user_id
                  }
                }
              ],
              as: 'userDetails' // This will add the matching documents to the `userDetails` array
            }
          },
          {
            $unwind: { // Unwind the array to extract the single user object
              path: '$userDetails',
              preserveNullAndEmptyArrays: true // Optional: Keep documents with no matching user
            }
          },
          {
            $project: { 
              adminid: 1, 
              username: { $ifNull: ['$userDetails.UserName', 'No username'] }, 
  
              symbol: 1,
              buy_qty: 1,
              sell_qty: 1,
              PositionAvg: 1,
              buy_type:1,
              sell_type:1,
              buy_type:1,
              sell_price:1,
              buy_lot:1,
              sell_lot:1,
              buy_time:1,
              sell_time:1,
              lotsize:1,
              token:1,
              requiredFund:1,
              reason:1,
              status:1,
              perlot:1,
              brokerage:1,
              limit:1,
              createdAt:1
            }
          }
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
      console.log("error-",error)
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }






  // position 
  async position(req, res) {
    try {
      const { userid } = req.body;

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const finduser = await mainorder_model
        .find({
          userid: userid,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        })
        .sort({ createdAt: -1 });

      if (!finduser || finduser.length === 0) {
        return res.json({
          status: false,
          error: "No positions found",
          data: [],
        });
      }

      const symbols = [...new Set(finduser.map((trade) => trade.symbol))];

      const tokenDataMap = await Symbol.find({ symbol: { $in: symbols } }).then(
        (symbolsData) =>
          symbolsData.reduce((map, symbolData) => {
            map[symbolData.symbol] = symbolData.token;
            return map;
          }, {})
      );

      const currentPosition = finduser.reduce(
        (acc, trade) => {
          const token = tokenDataMap[trade.symbol];

          acc.openPositions.push({
            _id: trade._id,
            symbol: trade.symbol,
            token: token,
            requiredFund: trade.requiredFund,
            lotsize: trade.lotsize,
            signal_type: trade.signal_type,
            buy_price: trade.buy_price,
            buy_lot: trade.buy_lot,
            buy_qty: trade.buy_qty,
            buy_type: trade.buy_type,
            buy_time: trade.buy_time,
            sell_type: trade.sell_type,
            sell_lot: trade.sell_lot,
            sell_qty: trade.sell_qty,
            sell_time: trade.sell_time,
            sell_price: trade.sell_price,
          });

          return acc;
        },
        { openPositions: [] }
      );

      res.json({ status: true, data: currentPosition.openPositions });
    } catch (error) {
      res.json({ status: false, error: "Internal Server Error", data: [] });
    }
  }




  // holding

  // async holding(req, res) {
  //   try {
  //     const { userid } = req.body;

  //     const today = new Date();
  //     const startOfToday = new Date(today.setHours(0, 0, 0, 0));

  //     // Find user orders and sort them by createdAt in ascending order
  //     const finduser = await mainorder_model
  //       .find({
  //         userid: userid,
  //         createdAt: { $lt: startOfToday },
  //       })
  //       .sort({ createdAt: -1 });

  //     if (!finduser || finduser.length === 0) {
  //       return res.json({
  //         status: false,
  //         error: "No positions found",
  //         data: [],
  //       });
  //     }

  //     const symbols = [...new Set(finduser.map((trade) => trade.symbol))];

  //     // Fetch token data for all unique symbols
  //     const tokenDataMap = await Symbol.find({ symbol: { $in: symbols } }).then(
  //       (symbolsData) =>
  //         symbolsData.reduce((map, symbolData) => {
  //           map[symbolData.symbol] = symbolData.token;
  //           return map;
  //         }, {})
  //     );

  //     const currentPosition = finduser.reduce(
  //       (acc, trade) => {
  //         const token = tokenDataMap[trade.symbol];
  //         if (trade.buy_type === "buy") {
  //           if (!acc.openPositions[trade.symbol]) {
  //             acc.openPositions[trade.symbol] = {
  //               _id:trade._id,
  //               signal_type:trade.signal_type,
  //               symbol: trade.symbol,
  //               token: token,
  //               lotsize:trade.lotsize,
  //               total_buy_price: 0,
  //               requiredFund: trade.requiredFund,
  //               total_buy_qty: 0,
  //               total_buy_lot: 0,
  //               buy_time: trade.buy_time,
  //               total_sell_price: 0,
  //               total_sell_qty: 0,
  //               total_sell_lot: 0,
  //               sell_time: null,
  //               createdAt: trade.createdAt,
  //             };
  //           }
  //           acc.openPositions[trade.symbol].total_buy_price +=
  //             trade.buy_price * trade.buy_qty;
  //           acc.openPositions[trade.symbol].total_buy_qty += trade.buy_qty;
  //           acc.openPositions[trade.symbol].total_buy_lot += trade.buy_lot;
  //         }

  //         if (trade.sell_type === "sell") {
  //           if (acc.openPositions[trade.symbol]) {
  //             acc.openPositions[trade.symbol].total_sell_price +=
  //               trade.sell_price * trade.sell_qty;
  //             acc.openPositions[trade.symbol].total_sell_qty += trade.sell_qty;
  //             acc.openPositions[trade.symbol].total_sell_lot += trade.sell_lot;
  //             acc.openPositions[trade.symbol].sell_time = trade.sell_time;
  //           }
  //         }
  //         return acc;
  //       },
  //       { openPositions: {} }
  //     );

  //     // Calculate average holding and format the response
  //     const formattedPositions = Object.values(
  //       currentPosition.openPositions
  //     ).map((pos) => {
  //       const avg_buy_price = pos.total_buy_qty
  //         ? pos.total_buy_price / pos.total_buy_qty
  //         : 0;
  //       const avg_sell_price = pos.total_sell_qty
  //         ? pos.total_sell_price / pos.total_sell_qty
  //         : 0;
  //       return {
  //         _id:pos._id,
  //         signal_type:pos.signal_type,
  //         symbol: pos.symbol,
  //         token: pos.token,
  //         lotsize: pos.lotsize,
  //         requiredFund: pos.requiredFund,
  //         avg_buy_price: avg_buy_price,
  //         total_buy_qty: pos.total_buy_qty,
  //         total_buy_lot: pos.total_buy_lot,
  //         total_buy_price: pos.total_buy_price, // Total buy price
  //         buy_time: pos.buy_time,
  //         avg_sell_price: avg_sell_price,
  //         total_sell_qty: pos.total_sell_qty,
  //         total_sell_lot: pos.total_sell_lot,
  //         total_sell_price: pos.total_sell_price, // Total sell price
  //         sell_time: pos.sell_time,
  //         createdAt: pos.createdAt,
  //       };
  //     });

  //     // Sort open positions by createdAt
  //     formattedPositions.sort(
  //       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  //     );

  //     res.json({ status: true, data: formattedPositions });
  //   } catch (error) {
  //     res.json({ status: false, error: "Internal Server Error", data: [] });
  //   }
  // }
  async holding(req, res) {
    try {
      const { userid } = req.body;
  
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  
      // Fetch all records before today
      const finduser = await mainorder_model
        .find({
          userid: userid,
          createdAt: { $lt: startOfDay }, 
        })
        .sort({ createdAt: -1 });
  
      if (!finduser || finduser.length === 0) {
        return res.json({
          status: false,
          error: "No holdings found",
          data: [],
        });
      }
  
      const symbols = [...new Set(finduser.map((trade) => trade.symbol))];
  
      const tokenDataMap = await Symbol.find({ symbol: { $in: symbols } }).then(
        (symbolsData) =>
          symbolsData.reduce((map, symbolData) => {
            map[symbolData.symbol] = symbolData.token;
            return map;
          }, {})
      );
  
      const currentHoldings = finduser.reduce(
        (acc, trade) => {
         
          if (trade.buy_lot === trade.sell_lot) {
            return acc;
          }
  
          const token = tokenDataMap[trade.symbol];
  
          acc.holdings.push({
            _id: trade._id,
            symbol: trade.symbol,
            token: token,
            requiredFund: trade.requiredFund,
            lotsize: trade.lotsize,
            signal_type: trade.signal_type,
            buy_price: trade.buy_price,
            buy_lot: trade.buy_lot,
            buy_qty: trade.buy_qty,
            buy_type: trade.buy_type,
            buy_time: trade.buy_time,
            sell_type: trade.sell_type,
            sell_lot: trade.sell_lot,
            sell_qty: trade.sell_qty,
            sell_time: trade.sell_time,
            sell_price: trade.sell_price,
          });
  
          return acc;
        },
        { holdings: [] }
      );
  
      res.json({ status: true, data: currentHoldings.holdings });
    } catch (error) {
      res.json({ status: false, error: "Internal Server Error", data: [] });
    }
  }
  
  


  // squareoff

  async Squareoff(req, res) {
    try {
      const { id, userid, symbol, type, lot, price, qty, requiredFund } = req.body;
  

      const priceNum = parseFloat(price);
      const lotNum = parseFloat(lot, 10);
      const qtyNum = parseFloat(qty, 10);
     
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
  
      // console.log(checkadmin) 
      //   const marginvalued = await MarginRequired.findOne({adminid:checkadmin.parent_id})

      //   console.log("marginvalued",marginvalued)
        
      // Calculate brokerage
      let brokerage = 0;
      if (checkadmin.pertrade) {
        brokerage = parseFloat(checkadmin.pertrade);
      } else if (checkadmin.perlot) {
        brokerage = parseFloat(checkadmin.perlot) * parseFloat(lot);
      }
  


      // Validate lot size based on the type
      if (type === "buy" && (tradehistory.buy_lot || 0) + lotNum > tradehistory.sell_lot) {
        return res.json({
          status: false,
          message: "The lot size is greater than allowed",
          data: [],
        });
      } else if (type === "sell" && (tradehistory.sell_lot || 0) + lotNum > tradehistory.buy_lot) {
        return res.json({
          status: false,
          message: "The lot size is greater than allowed",
          data: [],
        });
      }
  
     

      // Create a new order
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
        limit: checkadmin.limit,
        requiredFund,
        type,
        status: "Completed",
      });
  
      const orderdata = await newOrder.save();
  


      // Update trade history with new order ID
      if (Array.isArray(tradehistory.orderid)) {
        tradehistory.orderid.push(orderdata._id);
      } else {
        tradehistory.orderid = [orderdata._id];
      }
   

      let Calculatefund = priceNum * qtyNum
      let totalcalculatefund = Calculatefund/Number(checkadmin.limit);
      // let calculate_margin = 
      let Totalupdateuserbalance = totalcalculatefund - parseFloat(brokerage);
      
      let totaladdbalance = parseFloat(checkadmin.Balance) + Totalupdateuserbalance
     


      if (type === "buy") {
        const totalQuantity = (tradehistory.buy_lot || 0) + lotNum;
        const totalCost = (tradehistory.buy_price * tradehistory.buy_lot || 0) + (priceNum * lotNum);
        const avgPrice = totalCost / totalQuantity;

        tradehistory.buy_price = avgPrice;
        tradehistory.buy_lot = totalQuantity;
        tradehistory.buy_qty =  (tradehistory.buy_qty || 0) + qtyNum;;
        tradehistory.buy_type = type;
        // tradehistory.requiredFund = requiredFund;
        tradehistory.buy_time = new Date();
  
  

        await tradehistory.save();
      } else if (type === "sell") {
        const totalQuantity = (tradehistory.sell_lot || 0) + lotNum;
        const totalCost = (tradehistory.sell_price * tradehistory.sell_lot || 0) + (priceNum * lotNum);
        const avgPrice = totalCost / totalQuantity;
  
        tradehistory.sell_price = avgPrice;
        tradehistory.sell_lot = totalQuantity;
        tradehistory.sell_qty = (tradehistory.sell_qty || 0) + qtyNum;
        tradehistory.sell_type = type;
        tradehistory.sell_time = new Date();
          
  
        await tradehistory.save();

      }


  
      // Update user balance
      await User_model.updateOne(
        { _id: checkadmin._id },
        { $set: { Balance: totaladdbalance } }
      );
  
      // Create a new balance statement
      const newstatement = new BalanceStatement({
        userid: userid,
        orderid: orderdata._id,
        Amount: Totalupdateuserbalance,
        type: "CREDIT",
        message: "Balanced used to sell",
        symbol: symbol,
        brokerage: brokerage,
      });
  
      await newstatement.save();
  
      return res.json({
        status: true,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} order updated successfully`,
        data: [],
      });
  
    } catch (error) {
      console.log("error", error);
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

      let brokerage = 0;
      if (checkadmin.pertrade) {
        brokerage = parseFloat(checkadmin.pertrade);
      } else if (checkadmin.perlot) {
        brokerage = parseFloat(checkadmin.perlot) * parseFloat(lot);
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
        brokerage: brokerage,
        limit: checkadmin.limit,
        requiredFund,
        token: SymbolToken,
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
          brokerage
        );
      } else if (type === "sell") {
        await ExitTrade(
          req,
          res,
          orderdata,
          checkadmin,
          SymbolToken,
          brokerage
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




  // Switch between buy and sell orders based on the type of order placed by the user 
  async switchOrderType(req, res) {
    try {
      const { id } = req.body;
  
      const order = await mainorder_model.findOne({ _id: id });
  
      if (!order) {
        return res.json({ status: false, message: "Order not found" });
      }
  
      // Toggle the signal_type
      order.signal_type = order.signal_type === "buy_sell" ? "sell_buy" : "buy_sell";

      const temp = order.buy_price;
      order.buy_price = order.sell_price;
      order.sell_price = temp;
  
      await order.save();
      
      console.log("Order type switched", order.orderid);
      const firstHalf = order.orderid.slice(0, Math.ceil(order.orderid.length / 2));
      const secondHalf = order.orderid.slice(Math.ceil(order.orderid.length / 2));

      console.log("First Half:", firstHalf);
      console.log("Second Half:", secondHalf);

      // Fetch BalanceStatement documents matching each orderid
      const balanceStatementData = await BalanceStatement.find({
        orderid: { $in: firstHalf[0] }
      });
  
      const balanceStatementData1 = await BalanceStatement.find({
        orderid: { $in: secondHalf[0] }
      });
  
      var PriceUpdate = balanceStatementData[0].Amount
      var PriceUpdate1 = balanceStatementData1[0].Amount



      console.log("BalanceStatementData:", balanceStatementData[0].Amount);
      console.log("BalanceStatementData1:", balanceStatementData1[0].Amount);

      balanceStatementData[0].Amount = PriceUpdate1
      balanceStatementData1[0].Amount = PriceUpdate

      await balanceStatementData[0].save();
      await balanceStatementData1[0].save();
  
      // Return success response with the updated order and matched BalanceStatement data
      return res.json({ 
        status: true, 
        message: "Order type switched", 
        order, 
        balanceStatements: "" 
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ status: false, message: "An error occurred", error });
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
  brokerage
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
      
         
        const checkbalance = checkadmin.Balance * checkadmin.limit

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
    });

    await tradehistory.save();
    // }



    const limitclaculation =
      parseFloat(requiredFund) / Number(checkadmin.limit);
     const updateuserbalance =
     parseFloat(checkadmin.Balance) - parseFloat(limitclaculation);


    const Totalupdateuserbalance =
      parseFloat(updateuserbalance) - parseFloat(brokerage);



    await User_model.updateOne(
      { _id: checkadmin._id },
      { $set: { Balance: Totalupdateuserbalance } }
    );



    let newstatement = new BalanceStatement({
      userid: userid,
      orderid: orderdata._id,
      Amount: -limitclaculation,
      type: "DEBIT",
      message: "Balanced used to buy",
      symbol: symbol,
      brokerage: brokerage,
    });
    await newstatement.save();

    return res.json({
      status: true,
      message: "Order placed",
    });
  } catch (error) {
    return res
      .json({ status: false, message: "internal error", data: [] });
  }
};





// Exit trade
const ExitTrade = async (
  req,
  res,
  orderdata,
  checkadmin,
  SymbolToken,
  brokerage
) => {
  const { userid, symbol, price, type, lot, qty, lotsize, requiredFund } =
    req.body;

  const priceNum = parseFloat(price);
  const lotNum = parseFloat(lot, 10);
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

    // if (tradehistory) {
    //   const totalSellLot = (tradehistory.sell_qty || 0) + qtyNum;

    //   if (tradehistory.buy_qty < totalSellLot) {
    //    let sellQty = totalSellLot - tradehistory.buy_qty

    // }
    //     if (tradehistory.sell_lot == null && tradehistory.sell_price == null) {
    //       tradehistory.sell_price = priceNum;
    //       tradehistory.sell_lot = lotNum;
    //       tradehistory.sell_qty = qtyNum;
    //       tradehistory.sell_type = type;
    //       tradehistory.sell_time = new Date();
    //       if (Array.isArray(tradehistory.orderid)) {
    //         tradehistory.orderid.push(orderdata._id);
    //       } else {
    //         tradehistory.orderid = [tradehistory.orderid, orderdata._id];
    //       }
    //     } else {
    //       const totalQuantity = tradehistory.sell_lot + lotNum;
    //       const totalCost =
    //         tradehistory.sell_price * tradehistory.sell_lot + priceNum * lotNum;
    //       const avgPrice = totalCost / totalQuantity;

    //       tradehistory.sell_price = avgPrice;
    //       tradehistory.sell_lot += lotNum;
    //       tradehistory.sell_qty += qtyNum;
    //       tradehistory.sell_type = type;
    //       if (Array.isArray(tradehistory.orderid)) {
    //         tradehistory.orderid.push(orderdata._id);
    //       } else {
    //         tradehistory.orderid = [tradehistory.orderid, orderdata._id];
    //       }
    //     }

    //     await tradehistory.save();

    // const limitclaculation =
    //   parseFloat(tradehistory.sell_price) / Number(checkadmin.limit);
    // const updateuserbalance =
    //   parseFloat(checkadmin.Balance) + parseFloat(limitclaculation);

    // const Totalupdateuserbalance =
    //   parseFloat(updateuserbalance) - parseFloat(brokerage);

    // await User_model.updateOne(
    //   { _id: checkadmin._id },
    //   { $set: { Balance: Totalupdateuserbalance } }
    // );

    // let newstatement = new BalanceStatement({
    //   userid: userid,
    //   orderid: orderdata._id,
    //   Amount: limitclaculation,
    //   type: "CREDIT",
    //   message: "Balanced used to sell",
    //   symbol:symbol,
    //   brokerage:brokerage
    // });

    //     await newstatement.save();

    //     return res.json({
    //       status: true,
    //       message: "Order placed",
    //     });

    // } else {

    const checkbalance = checkadmin.Balance * checkadmin.limit

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
      limit: checkadmin.limit,
      status: "Completed",
      createdAt: currentTime,
      signal_type: "sell_buy",
    });

    await tradehistory.save();



    const limitclaculation =
      parseFloat(requiredFund) / Number(checkadmin.limit);
    const updateuserbalance =
      parseFloat(checkadmin.Balance) - parseFloat(limitclaculation);

    const Totalupdateuserbalance =
      parseFloat(updateuserbalance) - parseFloat(brokerage);



    await User_model.updateOne(
      { _id: checkadmin._id },
      { $set: { Balance: Totalupdateuserbalance } }
    );

    let newstatement = new BalanceStatement({
      userid: userid,
      orderid: orderdata._id,
      Amount: -limitclaculation,
      type: "DEBIT",
      message: "Balanced used to buy",
      symbol: symbol,
      brokerage: brokerage,
    });
    await newstatement.save();

    return res.json({
      status: true,
      message: "Order placed",
    });
    // }
  } catch (error) {
    console.error("Error processing sell order:", error);
    return res.json({
      status: false,
      message: "An error occurred while processing the sell order",
    });
  }
};



module.exports = new Placeorder();
