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
const BalanceStatement = db.BalanceStatement



class Placeorder {
  async getOrderBook(req, res) {
    try {
      const { userid } = req.body;

      const result = await Order.find({ userid }).sort({ createdAt: -1 });;

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
        result = await mainorder_model.find({ userid: userid }).sort({ createdAt: -1 });;
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
        result = await mainorder_model.find({ adminid: userid });

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

  // async position(req, res) {
  //   try {
  //     const { userid } = req.body;

  //     const today = new Date();
  //     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  //     const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  //     const finduser = await mainorder_model
  //       .find({
  //         userid: userid,
  //         createdAt: { $gte: startOfDay, $lte: endOfDay },
  //       })
  //       .sort({ createdAt: 1 }); // Sorting in ascending order by createdAt

  //     if (!finduser || finduser.length === 0) {
  //       return res.json({
  //         status: false,
  //         error: "No positions found",
  //         data: [],
  //       });
  //     }

  //     const tokendata = await Symbol.findOne({token:finduser.token})
  //    console.log("tokendata",tokendata)
  //    console.log("finduser",finduser)

  //     const currentPosition = finduser.reduce(
  //       (acc, trade) => {
  //         if (trade.buy_type === "buy") {
  //           acc.openPositions.push({
  //             symbol: trade.symbol,
  //             buy_price: trade.buy_price,
  //             buy_lot: trade.buy_lot,
  //             buy_qty: trade.buy_qty,
  //             buy_time: trade.buy_time,
  //             sell_type: trade.sell_type,
  //             sell_lot: trade.sell_lot,
  //             sell_qty: trade.sell_qty,
  //             sell_time: trade.sell_time,
  //           });
  //         }
  //         if (trade.sell_type === "sell") {
  //           const index = acc.openPositions.findIndex(
  //             (pos) => pos.symbol === trade.symbol
  //           );
  //           if (index !== -1) {
  //             acc.openPositions[index].sell_price = trade.sell_price;
  //             acc.openPositions[index].sell_lot = trade.sell_lot;
  //             acc.openPositions[index].sell_qty = trade.sell_qty;
  //             acc.openPositions[index].sell_time = trade.sell_time;
  //           }
  //         }
  //         return acc;
  //       },
  //       { openPositions: [] }
  //     );

  //     res.json({ status: true, data: currentPosition.openPositions });
  //   } catch (error) {
  //     res.json({ status: false, error: "Internal Server Error", data: [] });
  //   }
  // }

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

      // Find all unique symbols in the trades
      const symbols = [...new Set(finduser.map((trade) => trade.symbol))];

      // Fetch token data for all unique symbols
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
          if (trade.buy_type === "buy") {
            acc.openPositions.push({
              symbol: trade.symbol,
              token: token,
              requiredFund:trade.requiredFund,
              lotsize:trade.lotsize,
              buy_price: trade.buy_price,
              buy_lot: trade.buy_lot,
              buy_qty: trade.buy_qty,
              buy_type:trade.buy_type,
              buy_time: trade.buy_time,
              sell_type: trade.sell_type,
              sell_lot: trade.sell_lot,
              sell_qty: trade.sell_qty,
              sell_time: trade.sell_time,
              sell_price:trade.sell_price
            });
          }
          if (trade.sell_type === "sell") {
            const index = acc.openPositions.findIndex(
              (pos) => pos.symbol === trade.symbol
            );
            if (index !== -1) {
              acc.openPositions[index].sell_price = trade.sell_price;
              acc.openPositions[index].sell_lot = trade.sell_lot;
              acc.openPositions[index].sell_qty = trade.sell_qty;
              acc.openPositions[index].sell_time = trade.sell_time;
            }
          }
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
  //       .sort({ createdAt: 1 });

  //     if (!finduser || finduser.length === 0) {
  //       return res.json({
  //         status: false,
  //         error: "No positions found",
  //         data: [],
  //       });
  //     }

  //     const symbols = [...new Set(finduser.map(trade => trade.symbol))];

  //     // Fetch token data for all unique symbols
  //     const tokenDataMap = await Symbol.find({ symbol: { $in: symbols } })
  //       .then(symbolsData => symbolsData.reduce((map, symbolData) => {
  //         map[symbolData.symbol] = symbolData.token;
  //         return map;
  //       }, {}));

  //     const currentPosition = finduser.reduce(
  //       (acc, trade) => {
  //         const token = tokenDataMap[trade.symbol];
  //         if (trade.buy_type === "buy") {
  //           acc.openPositions.push({
  //             symbol: trade.symbol,
  //             token: token,
  //             buy_price: trade.buy_price,
  //             buy_lot: trade.buy_lot,
  //             buy_qty: trade.buy_qty,
  //             buy_time: trade.buy_time,
  //             sell_type: trade.sell_type,
  //             sell_lot: trade.sell_lot,
  //             sell_qty: trade.sell_qty,
  //             sell_time: trade.sell_time,
  //             createdAt: trade.createdAt,
  //           });
  //         }
  //         if (trade.sell_type === "sell") {
  //           const index = acc.openPositions.findIndex(
  //             (pos) => pos.symbol === trade.symbol
  //           );
  //           if (index !== -1) {
  //             acc.openPositions[index].sell_price = trade.sell_price;
  //             acc.openPositions[index].sell_lot = trade.sell_lot;
  //             acc.openPositions[index].sell_qty = trade.sell_qty;
  //             acc.openPositions[index].sell_time = trade.sell_time;
  //           }
  //         }
  //         return acc;
  //       },
  //       { openPositions: [] }
  //     );

  //     // Sort open positions by createdAt
  //     currentPosition.openPositions.sort(
  //       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  //     );

  //     res.json({ status: true, data: currentPosition.openPositions });
  //   } catch (error) {

  //     res.json({ status: false, error: "Internal Server Error", data: [] });
  //   }
  // }

  async holding(req, res) {
    try {
      const { userid } = req.body;

      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));

      // Find user orders and sort them by createdAt in ascending order
      const finduser = await mainorder_model
        .find({
          userid: userid,
          createdAt: { $lt: startOfToday },
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

      // Fetch token data for all unique symbols
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
          if (trade.buy_type === "buy") {
            if (!acc.openPositions[trade.symbol]) {
              acc.openPositions[trade.symbol] = {
                symbol: trade.symbol,
                token: token,
                lotsize:trade.lotsize,
                total_buy_price: 0,
                total_buy_qty: 0,
                total_buy_lot: 0,
                buy_time: trade.buy_time,
                total_sell_price: 0,
                total_sell_qty: 0,
                total_sell_lot: 0,
                sell_time: null,
                createdAt: trade.createdAt,
              };
            }
            acc.openPositions[trade.symbol].total_buy_price +=
              trade.buy_price * trade.buy_qty;
            acc.openPositions[trade.symbol].total_buy_qty += trade.buy_qty;
            acc.openPositions[trade.symbol].total_buy_lot += trade.buy_lot;
          }

          if (trade.sell_type === "sell") {
            if (acc.openPositions[trade.symbol]) {
              acc.openPositions[trade.symbol].total_sell_price +=
                trade.sell_price * trade.sell_qty;
              acc.openPositions[trade.symbol].total_sell_qty += trade.sell_qty;
              acc.openPositions[trade.symbol].total_sell_lot += trade.sell_lot;
              acc.openPositions[trade.symbol].sell_time = trade.sell_time;
            }
          }
          return acc;
        },
        { openPositions: {} }
      );

      // Calculate average holding and format the response
      const formattedPositions = Object.values(
        currentPosition.openPositions
      ).map((pos) => {
        const avg_buy_price = pos.total_buy_qty
          ? pos.total_buy_price / pos.total_buy_qty
          : 0;
        const avg_sell_price = pos.total_sell_qty
          ? pos.total_sell_price / pos.total_sell_qty
          : 0;
        return {
          symbol: pos.symbol,
          token: pos.token,
          lotsize:pos.lotsize,
          avg_buy_price: avg_buy_price,
          total_buy_qty: pos.total_buy_qty,
          total_buy_lot: pos.total_buy_lot,
          total_buy_price: pos.total_buy_price, // Total buy price
          buy_time: pos.buy_time,
          avg_sell_price: avg_sell_price,
          total_sell_qty: pos.total_sell_qty,
          total_sell_lot: pos.total_sell_lot,
          total_sell_price: pos.total_sell_price, // Total sell price
          sell_time: pos.sell_time,
          createdAt: pos.createdAt,
        };
      });

      // Sort open positions by createdAt
      formattedPositions.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      res.json({ status: true, data: formattedPositions });
    } catch (error) {
      res.json({ status: false, error: "Internal Server Error", data: [] });
    }
  }

  // placeorder

  async placeorder(req, res) {
    try {
      // Destructure request body to extract order details
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
        entry_exit,
      } = req.body;

      // Check if the user exists and has the role of "USER"
      const checkadmin = await User_model.findOne({
        _id: userid,
        Role: "USER",
      });
      if (!checkadmin) {
        return res.json({ status: false, message: "User not found", data: [] });
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
          lotsize,
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


      let brokerage = 0;
      if (checkadmin.pertrade) {
        brokerage = Number(checkadmin.pertrade);
      } else if (checkadmin.perlot) {
        brokerage = Number(checkadmin.perlot) * Number(lot);
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
        lotsize:lotsize,
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
        return res
          .status(400)
          .json({ status: false, message: "Invalid request" });
      }
    } catch (error) {
      // Return server error response
      res.json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
}

// place order entry trade

// const EntryTrade = async (req, res, orderdata, checkadmin, SymbolToken ,brokerage) => {
//   try {
//     const { userid, symbol, price, lot, qty, requiredFund, token, type } =
//       req.body;

//     const priceNum = parseFloat(price);
//     const lotNum = parseFloat(lot, 10);
//     const qtyNum = parseFloat(qty, 10);
//     const requiredFundNum = parseFloat(requiredFund);

//     let tradehistory = await mainorder_model.findOne({ userid,symbol,createdAt});

//     if (tradehistory) {
//       const totalQuantity = tradehistory.buy_lot + lotNum;
//       const totalCost =
//         tradehistory.buy_price * tradehistory.buy_lot + priceNum * lotNum;
//       const avgPrice = totalCost / totalQuantity;

//       tradehistory.buy_price = avgPrice;
//       tradehistory.buy_lot += lotNum;
//       tradehistory.buy_qty += qtyNum;
//       tradehistory.buy_type = type;

//       await tradehistory.save();
//     } else {
//       tradehistory = new mainorder_model({
//         orderid: orderdata._id,
//         userid,
//         symbol,
//         buy_type: type,
//         buy_price: price,
//         buy_lot: lot,
//         buy_qty: qty,
//         buy_time: new Date(),
//         requiredFund,
//         token: SymbolToken.token,
//         adminid: checkadmin.parent_id,
//         pertrade: checkadmin.userdata,
//         perlot: checkadmin.perlot,
//         turn_over_percentage: checkadmin.turn_over_percentage,
//         brokerage:brokerage,
//         limit: checkadmin.limit,
//         status: "Completed",
//       });

//       await tradehistory.save();
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Order placed",
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Server error", data: [] });
//   }
// };

const EntryTrade = async (
  req,
  res,
  orderdata,
  checkadmin,
  SymbolToken,
  brokerage,
) => {
  try {
    const {
      userid,
      symbol,
      price,
      lot,
      qty,
      requiredFund,
      lotsize,
      token,
      type,
    } = req.body;

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

    if (tradehistory) {
      const totalQuantity = tradehistory.buy_lot + lotNum;
      const totalCost =
        tradehistory.buy_price * tradehistory.buy_lot + priceNum * lotNum;
      const avgPrice = totalCost / totalQuantity;

      tradehistory.buy_price = avgPrice;
      tradehistory.buy_lot += lotNum;
      tradehistory.buy_qty += qtyNum;
      tradehistory.buy_type = type;

      if (Array.isArray(tradehistory.orderid)) {
        tradehistory.orderid.push(orderdata._id);
      } else {
        tradehistory.orderid = [tradehistory.orderid, orderdata._id];
      }

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
        buy_time: currentTime,
        requiredFund,
        lotsize:lotsize,
        token: SymbolToken.token,
        adminid: checkadmin.parent_id,
        pertrade: checkadmin.userdata,
        perlot: checkadmin.perlot,
        turn_over_percentage: checkadmin.turn_over_percentage,
        brokerage: brokerage,
        limit: checkadmin.limit,
        status: "Completed",
        createdAt: currentTime,
      });

      await tradehistory.save();

    }
      
    const limitclaculation = parseFloat(requiredFund)/Number(checkadmin.limit)
    
    const updateuserbalance = parseFloat(checkadmin.Balance) - parseFloat(limitclaculation)
    
    await User_model.updateOne(
      { _id: checkadmin._id },
      { $set: { Balance: updateuserbalance} }
    );
    
    
    let newstatement = new BalanceStatement({
      userid: orderdata._id,
      Amount : -limitclaculation,
      type:"DEBIT",
      message:"Balanced used to buy"
    });

    await newstatement.save();

   
    return res.status(200).json({
      status: true,
      message: "Order placed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: [] });
  }
};





// placeorder exit trade

// const ExitTrade = async (req, res, orderdata, checkadmin , brokerage) => {
//   const { userid, symbol, price, type, lot, qty } = req.body;

//   const priceNum = parseFloat(price);
//   const lotNum = parseFloat(lot, 10);
//   const qtyNum = parseFloat(qty, 10);
//   // const requiredFundNum = parseFloat(requiredFund);

//   let tradehistory = await mainorder_model.findOne({ userid, symbol });

//   if (tradehistory) {
//     if (
//       tradehistory.buy_lot >=
//       parseFloat(lot) + parseFloat(tradehistory.sell_lot || 0)
//     ) {
//       if (tradehistory.sell_lot == null && tradehistory.sell_price == null) {
//         tradehistory.sell_price = price;
//         tradehistory.sell_lot = lot;
//         tradehistory.sell_qty = qty;
//         tradehistory.sell_type = type;
//         tradehistory.sell_time = new Date();
//         await tradehistory.save();
//       } else {
//         const totalQuantity = tradehistory.sell_lot + lotNum;
//         const totalCost =
//           tradehistory.sell_price * tradehistory.sell_lot + priceNum * lotNum;
//         const avgPrice = totalCost / totalQuantity;

//         tradehistory.sell_price = avgPrice;
//         tradehistory.sell_lot += lotNum;
//         tradehistory.sell_qty += qtyNum;
//         tradehistory.sell_type = type;

//         await tradehistory.save();
//       }
//     } else {
//       console.log("Entry Not Exist");
//     }
//   } else {
//     console.log("Entry Not Exist");
//   }

//   return res.status(200).json({
//     status: true,
//     message: "Order placed",
//   });
// };

const ExitTrade = async (req, res, orderdata, checkadmin, brokerage) => {
  const { userid, symbol, price, type, lot, qty , lotsize } = req.body;

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

    if (tradehistory) {
      const totalSellLot = (tradehistory.sell_lot || 0) + lotNum;

      if (tradehistory.buy_lot >= totalSellLot) {
        if (tradehistory.sell_lot == null && tradehistory.sell_price == null) {
        

          tradehistory.sell_price = priceNum;
          tradehistory.sell_lot = lotNum;
          tradehistory.sell_qty = qtyNum;
          tradehistory.sell_type = type;
          tradehistory.sell_time = new Date();
          if (Array.isArray(tradehistory.orderid)) {
            tradehistory.orderid.push(orderdata._id);
          } else {
            tradehistory.orderid = [tradehistory.orderid, orderdata._id];
          }
        } else {
  
          const totalQuantity = tradehistory.sell_lot + lotNum;
          const totalCost =
            tradehistory.sell_price * tradehistory.sell_lot + priceNum * lotNum;
          const avgPrice = totalCost / totalQuantity;

          tradehistory.sell_price = avgPrice;
          tradehistory.sell_lot += lotNum;
          tradehistory.sell_qty += qtyNum;
          tradehistory.sell_type = type;
          if (Array.isArray(tradehistory.orderid)) {
            tradehistory.orderid.push(orderdata._id);
          } else {
            tradehistory.orderid = [tradehistory.orderid, orderdata._id];
          }
        }

        await tradehistory.save();

        let newstatement = new BalanceStatement({
          userid: orderdata._id,
          Amount : tradehistory.sell_price,
          type:"CREDIT",
          message:"Balanced used to sell"
        });
    
        await newstatement.save();
         

        return res.json({
          status: true,
          message: "Order placed",
        });
      } else {
        return res.json({
          status: false,
          message: "Insufficient buy lot for the sell order",
        });
      }
    } else {
      return res.json({
        status: false,
        message: "Entry not found",
      });
    }
  } catch (error) {
    console.error("Error processing sell order:", error);
    return res.json({
      status: false,
      message: "An error occurred while processing the sell order",
    });
  }
};

module.exports = new Placeorder();
