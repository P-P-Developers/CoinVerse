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
        Sl_price_percentage: 1, 
        live_price: "$livePriceData.Bid_Price", 
        checkSlPercent: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    { $eq: ["$signal_type", "buy_sell"] },
                    {
                      $lte: [
                        "$livePriceData.Bid_Price",
                        {
                          $ifNull: [
                            {
                              $cond: {
                                if: { $regexMatch: { input: "$Sl_price_percentage", regex: /^[0-9]+(\.[0-9]+)?$/ } },
                                then: { $toDouble: "$Sl_price_percentage" },
                                else: null,
                              },
                            },
                            false,
                          ],
                        },
                      ],
                    },
                  ],
                },
                then: true,
              },
              {
                case: {
                  $and: [
                    { $eq: ["$signal_type", "sell_buy"] },
                    {
                      $gte: [
                        "$livePriceData.Bid_Price",
                        {
                          $ifNull: [
                            {
                              $cond: {
                                if: { $regexMatch: { input: "$Sl_price_percentage", regex: /^[0-9]+(\.[0-9]+)?$/ } },
                                then: { $toDouble: "$Sl_price_percentage" },
                                else: null,
                              },
                            },
                            false,
                          ],
                        },
                      ],
                    },
                  ],
                },
                then: true,
              },
            ],
            default: false,
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
