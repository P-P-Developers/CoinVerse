"use strict";

const db = require("../../Models");
const Symbol = db.Symbol;
const Userwatchlist = db.Userwatchlist;
const Favouritelist = db.Favouritelist;
const { isArray } = require("lodash"); // Assuming lodash is being used

class UserSymbol {
  //user search symbol
  async symbolSearch(req, res) {
    try {
      const symboleName = req.body.symboleName;
      let condition = {};

      // If symboleName is not an empty string, add the regex condition for symbol search
      if (symboleName && symboleName.trim() !== "") {
        condition.trading_symbol = { $regex: symboleName, $options: "i" };
      }

      const symbols = await Symbol.find(condition)
        .select("-symbol")
        .sort({ trading_symbol: "asc" })
        .lean();

      // If no symbols are found or the first symbol has status 0, return not found
      if (symbols.length === 0 || symbols[0].status == 0) {
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

  async addSymbol(req, res) {
    const { userid, symbolname } = req.body;

    let SymbolsArr = isArray(symbolname) ? symbolname : [symbolname];

    if (!SymbolsArr.length) {
      return res.status(400).json({
        status: false,
        message: "Symbol list is empty or invalid.",
        data: [],
      });
    }

    try {
      const addedSymbols = [];
      const skippedSymbols = [];

      for (const sym of SymbolsArr) {
        const symbolTrimmed = sym.trim();

        // Check if already exists in user's watchlist
        const exists = await Userwatchlist.findOne({
          userid,
          symbol: symbolTrimmed,
        });
        if (exists) {
          skippedSymbols.push({
            symbol: symbolTrimmed,
            reason: "Already added",
          });
          continue;
        }

        // Check if symbol exists in master symbol list
        const symbol = await Symbol.findOne({
          trading_symbol: symbolTrimmed,
        }).lean();
        if (!symbol) {
          skippedSymbols.push({
            symbol: symbolTrimmed,
            reason: "Symbol not found",
          });
          continue;
        }

        // Save new entry to watchlist
        const newEntry = new Userwatchlist({
          userid,
          symbol: symbolTrimmed,
          token: symbol.token,
          symbol_name: symbol.symbol,
          exch_seg: symbol.exch_seg,
          lotsize: symbol.lotsize,
        });

        const saved = await newEntry.save();
        addedSymbols.push(saved);
      }

      return res.status(201).json({
        status: true,
        message: "Symbols processed.",
        added: addedSymbols,
        skipped: skippedSymbols,
      });
    } catch (err) {
      console.error("Error in addSymbol:", err);
      return res.status(500).json({
        status: false,
        message: "Server error occurred while adding symbols.",
        data: [],
      });
    }
  }

  // Userwatchlist with favourite status new code
  async userSymbollist(req, res) {
    try {
      const userWatchlistRecords = await Userwatchlist.find({
        userid: req.body.userid,
      })
        .select("-createdAt -_id")
        .sort({ _id: -1 });

      const favouriteList = await Favouritelist.find({
        userid: req.body.userid,
      }).select("symbol");

      const favouriteSymbols = favouriteList.map((item) => item.symbol);

      const result = await Userwatchlist.aggregate([
        { $match: { userid: req.body.userid } },
        {
          $lookup: {
            from: "symbols",
            localField: "symbol",
            foreignField: "symbol",
            as: "symbolDetails",
            pipeline: [{ $match: { status: 1 } }],
          },
        },
        { $unwind: "$symbolDetails" },

        {
          $lookup: {
            from: "live_prices",
            localField: "token",
            foreignField: "Ticker",
            as: "live_pricesdt",
          },
        },
        { $unwind: "$live_pricesdt" },
        {
          $project: {
            symbol: 1,
            userid: 1,
            token: 1,
            symbol_name: 1,
            exch_seg: 1,
            lotsize: "$symbolDetails.lotsize",
            lastpricedt: "$live_pricesdt.lastprice",
            liveprice: "$live_pricesdt.Mid_Price"

          },
        },
      ]);

      result.forEach((item) => {
        if (favouriteSymbols.includes(item.symbol)) {
          item.isFav = true;
        } else {
          item.isFav = false;
        }
      });

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
            pipeline: [
              { $match: { status: 1 } }, // Includingg status = 1
            ],
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
      const userWatchlistRecord = await Favouritelist.find(condition).lean();

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

  // Remove symbol from Favurite list
  async removeFavourite(req, res) {
    const condition = {
      userid: req.body.userid,
      symbol: req.body.symbolname,
    };

    try {
      const userWatchlistRecord = await Favouritelist.findOne(condition).lean();
      if (!userWatchlistRecord) {
        return res.json({
          status: false,
          message: "Symbol not found in the favorite list!",
          data: [],
        });
      }

      // Remove the symbol from the favorite list
      await Favouritelist.deleteOne(condition);

      return res.json({
        status: true,
        message: "Symbol removed successfully!",
        data: [],
      });
    } catch (err) {
      return res.json({
        status: false,
        message:
          err.message || "Some error occurred while removing the symbol.",
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
