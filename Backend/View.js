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
          preserveNullAndEmptyArrays: true, // Ensure no missing matches cause a failure
        },
      },
      {
        $match: {
          status: "Completed",
          $or: [{ buy_type: null }, { sell_type: null }],
        },
      },
      {
        $addFields: {
          live_price: "$livePriceData.Bid_Price", // Add the Bid_Price as live_price
        },
      },
      {
        $project: {
          companyData: 0,
          live_price: 1, 
        },
      },
    ]
  );
  