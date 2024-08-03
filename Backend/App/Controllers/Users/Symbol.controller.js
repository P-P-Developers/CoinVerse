"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const Symbol = db.Symbol;
const Userwatchlist = db.Userwatchlist;
const Favouritelist = db.Favouritelist


class UserSymbol {


  //user search symbol

  async symbolSearch(req, res) {
    try {
      const symboleName = req.body.symboleName;
      let condition = {};

      if (symboleName) {
        condition.trading_symbol = { $regex: symboleName, $options: "i" };
      }

      const symbols = await Symbol.find(condition)
        .select("-symbol")
        .sort({ trading_symbol: "asc" })

      if(symbols[0].status == 0){
        return res.json({
          status: false,
          message: "Symbol not found",
          data: [],
        });
      }
      
      if (!symboleName || symbols.length === 0) {
        return res.json({
          status: false,
          message: "Symbol not found",
          data: [],
        });
      }

      return res.json({ status: true, message: "Find Success", data: symbols });

    } catch (err) {
      return res.json({
        status: false,
        message: err.message || "Some error occurred while retrieving symbols.",
        data: [],
      });
    }
  }




  // add user symbol

  async addSymbol(req, res) {
    const condition = {
      userid: req.body.userid,
      symbol: req.body.symbolname,
    };

    try {
      const userWatchlistRecord = await Userwatchlist.find(condition);

      if (userWatchlistRecord.length > 0) {
        return res.json({
          status: false,
          message: "Symbol already added!",
          data: [],
        });
      }

      const symbol = await Symbol.findOne({
        trading_symbol: req.body.symbolname,
      });

      if (!symbol) {
        return res.json({
          status: false,
          message: "Symbol not found!",
          data: [],
        });
      }

      const newUserWatchlist = new Userwatchlist({
        userid: req.body.userid,
        symbol: req.body.symbolname,
        token: symbol.token,
        symbol_name: symbol.symbol,
        exch_seg: symbol.exch_seg,
        lotsize: symbol.lotsize,
      });

      const userWatchlist = await newUserWatchlist.save();

      return res.json({
        status: true,
        message: "Symbol added successfully!",
        data: userWatchlist,
      });
    } catch (err) {
      return res.json({
        status: false,
        message: err.message || "Some error occurred while adding the symbol.",
        data: [],
      });
    }
  }


  // user symbol list
  // async userSymbollist(req, res) {
  //   try {

  //     const userWatchlistRecords = await Userwatchlist.find({
  //       userid: req.body.userid,

  //     })
  //       .select("-createdAt -_id")
  //       .sort({ _id: -1 });

  //     if (userWatchlistRecords.length > 0) {
  //       return res.json({ status: true, data: userWatchlistRecords });

  //     } else {
  //       res.json({ status: false, message: "No data available", data: [] });
  //     }

  //   } catch (err) {

  //     return res.json({
  //       status: false,
  //       message: err.message || "An error occurred while retrieving the User Symbol List.",
  //       data: []
  //     });
  //   }
  // }


// user userwalist list
  async userSymbollist(req, res) {
    try {
     
      const userWatchlistRecords = await Userwatchlist.find({
        userid: req.body.userid,
      })
        .select("-createdAt -_id")
        .sort({ _id: -1 });

      const result = await Userwatchlist.aggregate([
        { $match: { userid: req.body.userid } },
        {
          $lookup: {
            from: "symbols",
            localField: "symbol",
            foreignField: "symbol",
            as: "symbolDetails",
          },
        },
        { $unwind: "$symbolDetails" },
        {
          $project: {
            symbol: 1,
            userid: 1,
            token: 1,
            symbol_name: 1,
            exch_seg: 1,

            lotsize: "$symbolDetails.lotsize",
          },
        },
      ]);

      // Check if records are found and return the appropriate response
      if (result.length > 0) {
        return res.json({ status: true, data: result });
      } else {
        res.json({ status: false, message: "No data available", data: [] });
      }
    } catch (err) {
      return res.json({
        status: false,
        message:
          err.message ||
          "An error occurred while retrieving the User Symbol List.",
        data: [],
      });
    }
  }


  // user userwalist2 list

  async getFavouritelist(req, res) {
    try {
     
      const userWatchlistRecords = await Favouritelist.find({
        userid: req.body.userid,
      })
        .select("-createdAt -_id")
        .sort({ _id: -1 });

      const result = await Favouritelist.aggregate([
        { $match: { userid: req.body.userid } },
        {
          $lookup: {
            from: "symbols",
            localField: "symbol",
            foreignField: "symbol",
            as: "symbolDetails",
          },
        },
        { $unwind: "$symbolDetails" },
        {
          $project: {
            symbol: 1,
            userid: 1,
            token: 1,
            symbol_name: 1,
            exch_seg: 1,

            lotsize: "$symbolDetails.lotsize",
          },
        },
      ]);

      // Check if records are found and return the appropriate response
      if (result.length > 0) {
        return res.json({ status: true, data: result });
      } else {
        res.json({ status: false, message: "No data available", data: [] });
      }
    } catch (err) {
      return res.json({
        status: false,
        message:
          err.message ||
          "An error occurred while retrieving the User Symbol List.",
        data: [],
      });
    }
  }



  
  // add favouritelist

 async Favouritelist(req, res) {
    const condition = {
      userid: req.body.userid,
      symbol: req.body.symbolname,
    };

    try {
      const userWatchlistRecord = await Favouritelist.find(condition);

      if (userWatchlistRecord.length > 0) {
        return res.json({
          status: false,
          message: "Symbol already added!",
          data: [],
        });
      }

      const symbol = await Symbol.findOne({
        trading_symbol: req.body.symbolname,
      });

      if (!symbol) {
        return res.json({
          status: false,
          message: "Symbol not found!",
          data: [],
        });
      }

      const newUserWatchlist = new Favouritelist({
        userid: req.body.userid,
        symbol: req.body.symbolname,
        token: symbol.token,
        symbol_name: symbol.symbol,
        exch_seg: symbol.exch_seg,
        lotsize: symbol.lotsize,
      });

      const userWatchlist = await newUserWatchlist.save();

      return res.json({
        status: true,
        message: "Symbol added successfully!",
        data: userWatchlist,
      });
    } catch (err) {
      return res.json({
        status: false,
        message: err.message || "Some error occurred while adding the symbol.",
        data: [],
      });
    }
  }



  // delete  user  symbole

  async deletwatchlistsymbol(req, res) {
    const { symbolname, userid } = req.body;
    try {
      const result = await Userwatchlist.deleteOne({
        symbol: symbolname,
        userid: userid,
      });

      if (result.deletedCount === 1) {
        return res.send({
          status: true,
          message: "Symbol was deleted successfully!",
          data: result,
        });
      } else {
        return res.send({
          status: false,
          message: `Cannot delete Watchlist with symbol=${symbolname}. Was not found!`,
          data: [],
        });
      }
    } catch (err) {
      return res.send({
        status: false,
        message: "Could not delete Watchlist with symbol=" + symbolname,
        data: [],
      });
    }
  }
}



module.exports = new UserSymbol();
