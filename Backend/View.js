db.createView(
  "open_position",
  "mainorders",
  [
    {
      $lookup: {
        from: "companies",
        pipeline: [
          {
            $project: {
              _id: 0,
              startOfDay: 1,
              endOfDay: 1,
            },
          },
        ],
        as: "companyData",
      },
    },
    {
      $unwind: "$companyData",
    },
    {
      $lookup: {
        from: "live_prices",
        localField: "token", // Field in mainorders
        foreignField: "ticker", // Field in live_prices
        as: "livePriceData",
      },
    },
    {
      $unwind: {
        path: "$livePriceData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        status: "Completed",
        $or: [{ buy_type: null }, { sell_type: null }],
      },
    },
    {
      $project: {
        _id: 1,
        userid: 1,
        adminid:1,
        symbol: 1,
        buy_price: 1,
        sell_price: 1,
        buy_lot: 1,
        sell_lot: 1,
        buy_qty: 1,
        sell_qty:1,
        token: 1,
        buy_type: 1,
        sell_type: 1,
        status: 1,
        signal_type: 1,
        lotsize: 1,
        Sl_price_percentage: 1, // Include Sl_price_percentage
        live_price: "$livePriceData.Bid_Price", // Include Bid_Price as live_price
        checkSlPercent: {
          $cond: {
            if: {
              $lte: [
                "$livePriceData.Bid_Price",
                { $ifNull: ["$Sl_price_percentage", false] }, // Default to false if null/undefined
              ],
            },
            then: true,
            else: false,
          },
        },
        buy_time: 1,
        sell_time: 1,
        status: 1,
        requiredFund:1
      },
    },
  ]
);
