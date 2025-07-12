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
        localField: "token",
        foreignField: "ticker",
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
        adminid: 1,
        symbol: 1,
        buy_price: 1,
        sell_price: 1,
        buy_lot: 1,
        sell_lot: 1,
        buy_qty: 1,
        sell_qty: 1,
        token: 1,
        buy_type: 1,
        sell_type: 1,
        Sl_price_percentage: 1,
        Target_price: 1,
        stoploss_price: 1,
        signal_type: 1,
        status: 1,
        lotsize: 1,
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


        checkSlPercent_sl: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    { $ne: ["$stoploss_price", null] },
                    { $regexMatch: { input: "$stoploss_price", regex: /^[0-9]+(\.[0-9]+)?$/ } }, // Check valid numeric format
                    { $eq: ["$signal_type", "buy_sell"] },
                    {
                      $lte: [
                        "$livePriceData.Bid_Price",
                        {
                          $toDouble: "$stoploss_price",
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
                    { $ne: ["$stoploss_price", null] }, // Check for null
                    { $regexMatch: { input: "$stoploss_price", regex: /^[0-9]+(\.[0-9]+)?$/ } }, // Check valid numeric format
                    { $eq: ["$signal_type", "sell_buy"] },
                    {
                      $gte: [
                        "$livePriceData.Bid_Price",
                        {
                          $toDouble: "$stoploss_price",
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


        checkSlPercent_target: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    { $eq: ["$signal_type", "buy_sell"] },
                    {
                      $ne: ["$Target_price", null]
                    }, // Check if Target_price is not null
                    {
                      $regexMatch: {
                        input: "$Target_price",
                        regex: /^[0-9]+(\.[0-9]+)?$/
                      }, // Ensure Target_price is a valid numeric value
                    },
                    {
                      $gte: [
                        "$livePriceData.Bid_Price",
                        { $toDouble: "$Target_price" },
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
                      $ne: ["$Target_price", null]
                    }, // Check if Target_price is not null
                    {
                      $regexMatch: {
                        input: "$Target_price",
                        regex: /^[0-9]+(\.[0-9]+)?$/
                      }, // Ensure Target_price is a valid numeric value
                    },
                    {
                      $lte: [
                        "$livePriceData.Bid_Price",
                        { $toDouble: "$Target_price" },
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
        requiredFund: 1
      },
    },
  ]
);





db.createView("orderExecutionView", "orders", [
  {
    $match: {
      type: { $in: ["buy", "sell"] },
      status: "Pending",
      selectedOption: { $in: ["Limit", "Stop"] }
    }
  },
  {
    $lookup: {
      from: "live_prices",
      let: { orderSymbol: "$symbol" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: [
                { $toLower: "$ticker" },
                { $toLower: "$$orderSymbol" }
              ]
            }
          }
        }
      ],
      as: "live"
    }
  },
  {
    $unwind: {
      path: "$live",
      preserveNullAndEmptyArrays: false
    }
  },
  {
    $addFields: {
      executeCondition: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  { $eq: ["$type", "buy"] },
                  { $eq: ["$selectedOption", "Limit"] },
                  { $lte: [{ $toDouble: "$live.Ask_Price" }, { $toDouble: "$price" }] }
                ]
              },
              then: true
            },
            {
              case: {
                $and: [
                  { $eq: ["$type", "sell"] },
                  { $eq: ["$selectedOption", "Limit"] },
                  { $gte: [{ $toDouble: "$live.Bid_Price" }, { $toDouble: "$price" }] }
                ]
              },
              then: true
            },
            {
              case: {
                $and: [
                  { $eq: ["$type", "buy"] },
                  { $eq: ["$selectedOption", "Stop"] },
                  { $gte: [{ $toDouble: "$live.Ask_Price" }, { $toDouble: "$price" }] }
                ]
              },
              then: true
            },
            {
              case: {
                $and: [
                  { $eq: ["$type", "sell"] },
                  { $eq: ["$selectedOption", "Stop"] },
                  { $lte: [{ $toDouble: "$live.Bid_Price" }, { $toDouble: "$price" }] }
                ]
              },
              then: true
            }
          ],
          default: false
        }
      }
    }
  },

  {
    $addFields: {
      slstatus: "$executeCondition",
      livePrice: {
        $cond: {
          if: { $eq: ["$type", "buy"] },
          then: "$live.Ask_Price",
          else: "$live.Bid_Price"
        }
      }
    }
  },
  {
    $project: {
      executeCondition: 0,
      live: 0
    }
  }
])



// over all view 



// db.createView(
//   "user_overall_fund",
//   "mainorders",
//   [
//     {
//       $match: {
//         $or: [
//           { buy_price: { $ne: null }, sell_price: null },
//           { sell_price: { $ne: null }, buy_price: null },
//         ]
//       }
//     },
//     {
//       $group: {
//         _id: "$userid",
//         usedFund: { $sum: "$requiredFund" },
//         orders: { $push: "$$ROOT" }
//       }
//     },
//     {
//       $addFields: {
//         userIdAsObjectId: { $toObjectId: "$_id" }
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "userIdAsObjectId",
//         foreignField: "_id",
//         as: "user"
//       }
//     },
//     {
//       $unwind: "$user"
//     },
//     {
//       $addFields: {
//         userid: "$userIdAsObjectId",
//         balance: { $toDouble: "$user.Balance" },
//         totalFund: {
//           $add: [
//             { $toDouble: "$user.Balance" },
//             "$usedFund"
//           ]
//         }
//       }
//     },
//     {
//       $addFields: {
//         eightyPercentOfTotalFund: {
//           $multiply: ["$totalFund", 0.8]
//         },
//         overallstatus: {
//           $gte: ["$usedFund", { $multiply: ["$totalFund", 0.8] }]
//         }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         userid: 1,
//         balance: 1,
//         usedFund: 1,
//         totalFund: 1,
//         eightyPercentOfTotalFund: 1,
//         overallstatus: 1,
//         orders: 1
//       }
//     }
//   ]
// );



db.createView(
  "user_overall_fund",
  "mainorders",
  [
    {
      $match: {
        $or: [
          { buy_price: { $ne: null }, sell_price: null },
          { sell_price: { $ne: null }, buy_price: null }
        ]
      }
    },
    {
      $group: {
        _id: "$userid",
        usedFund: { $sum: "$requiredFund" },
        orders: { $push: "$$ROOT" }
      }
    },
    {
      $addFields: {
        userIdAsObjectId: { $toObjectId: "$_id" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userIdAsObjectId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "ticker",
        let: { orderSymbols: "$orders.symbol" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$symbol", "$$orderSymbols"] }
            }
          }
        ],
        as: "live_prices"
      }
    },
    {
      $lookup: {
        from: "orders",
        let: { userIdStr: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userid", "$$userIdStr"] },
              status: "Pending"
            }
          }
        ],
        as: "pending_orders"
      }
    },
    {
      $addFields: {
        holdingPNL: {
          $sum: {
            $map: {
              input: "$orders",
              as: "order",
              in: {
                $let: {
                  vars: {
                    live: {
                      $first: {
                        $filter: {
                          input: "$live_prices",
                          as: "lp",
                          cond: { $eq: ["$$lp.symbol", "$$order.symbol"] }
                        }
                      }
                    }
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ["$$order.buy_price", null] },
                          { $eq: ["$$order.sell_price", null] }
                        ]
                      },
                      {
                        $multiply: [
                          {
                            $subtract: [
                              { $toDouble: "$$live.Mid_Price" },
                              "$$order.buy_price"
                            ]
                          },
                          "$$order.buy_qty"
                        ]
                      },
                      0
                    ]
                  }
                }
              }
            }
          }
        },
        conditionalPNL: {
          $sum: {
            $map: {
              input: "$pending_orders",
              as: "porder",
              in: {
                $let: {
                  vars: {
                    live: {
                      $first: {
                        $filter: {
                          input: "$live_prices",
                          as: "lp",
                          cond: { $eq: ["$$lp.symbol", "$$porder.symbol"] }
                        }
                      }
                    },
                    price: { $toDouble: "$$porder.price" },
                    qty: { $toDouble: "$$porder.qty" },
                    type: "$$porder.type",
                    selectedOption: "$$porder.selectedOption"
                  },
                  in: {
                    $switch: {
                      branches: [
                        {
                          // Market Buy = Mid_Price - price
                          case: {
                            $and: [
                              { $eq: ["$$selectedOption", "Market"] },
                              { $eq: ["$$type", "buy"] }
                            ]
                          },
                          then: {
                            $multiply: [
                              {
                                $subtract: [
                                  { $toDouble: "$$live.Mid_Price" },
                                  "$$price"
                                ]
                              },
                              "$$qty"
                            ]
                          }
                        },
                        {
                          // Market Sell = price - Mid_Price
                          case: {
                            $and: [
                              { $eq: ["$$selectedOption", "Market"] },
                              { $eq: ["$$type", "sell"] }
                            ]
                          },
                          then: {
                            $multiply: [
                              {
                                $subtract: [
                                  "$$price",
                                  { $toDouble: "$$live.Mid_Price" }
                                ]
                              },
                              "$$qty"
                            ]
                          }
                        },
                        {
                          // Limit Buy (if Ask_Price <= price)
                          case: {
                            $and: [
                              { $eq: ["$$selectedOption", "Limit"] },
                              { $eq: ["$$type", "buy"] },
                              { $lte: [{ $toDouble: "$$live.Ask_Price" }, "$$price"] }
                            ]
                          },
                          then: {
                            $multiply: [
                              {
                                $subtract: [
                                  { $toDouble: "$$live.Ask_Price" },
                                  "$$price"
                                ]
                              },
                              "$$qty"
                            ]
                          }
                        },
                        {
                          // Limit Sell (if Bid_Price >= price)
                          case: {
                            $and: [
                              { $eq: ["$$selectedOption", "Limit"] },
                              { $eq: ["$$type", "sell"] },
                              { $gte: [{ $toDouble: "$$live.Bid_Price" }, "$$price"] }
                            ]
                          },
                          then: {
                            $multiply: [
                              {
                                $subtract: [
                                  "$$price",
                                  { $toDouble: "$$live.Bid_Price" }
                                ]
                              },
                              "$$qty"
                            ]
                          }
                        },
                        {
                          // Stop Buy (if Ask_Price >= price)
                          case: {
                            $and: [
                              { $eq: ["$$selectedOption", "Stop"] },
                              { $eq: ["$$type", "buy"] },
                              { $gte: [{ $toDouble: "$$live.Ask_Price" }, "$$price"] }
                            ]
                          },
                          then: {
                            $multiply: [
                              {
                                $subtract: [
                                  { $toDouble: "$$live.Ask_Price" },
                                  "$$price"
                                ]
                              },
                              "$$qty"
                            ]
                          }
                        },
                        {
                          // Stop Sell (if Bid_Price <= price)
                          case: {
                            $and: [
                              { $eq: ["$$selectedOption", "Stop"] },
                              { $eq: ["$$type", "sell"] },
                              { $lte: [{ $toDouble: "$$live.Bid_Price" }, "$$price"] }
                            ]
                          },
                          then: {
                            $multiply: [
                              {
                                $subtract: [
                                  "$$price",
                                  { $toDouble: "$$live.Bid_Price" }
                                ]
                              },
                              "$$qty"
                            ]
                          }
                        }
                      ],
                      default: 0
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    {
      $addFields: {
        balance: { $toDouble: "$user.Balance" },
        totalFund: {
          $add: [
            { $toDouble: "$user.Balance" },
            "$usedFund",
            "$holdingPNL",
            "$conditionalPNL"
          ]
        }
      }
    },
    {
      $addFields: {
        eightyPercentOfTotalFund: {
          $multiply: ["$totalFund", 0.8]
        },
        overallstatus: {
          $gte: ["$usedFund", { $multiply: ["$totalFund", 0.8] }]
        }
      }
    },
    {
      $project: {
        _id: 0,
        userid: "$userIdAsObjectId",
        balance: 1,
        usedFund: 1,
        holdingPNL: 1,
        conditionalPNL: 1,
        totalFund: 1,
        eightyPercentOfTotalFund: 1,
        overallstatus: 1,
        orders: 1
      }
    }
  ]
);
