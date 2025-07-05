var cron = require("node-cron");
const db = require("../../Models");
const Company = db.Company;
const user = db.user;
const mainorder_model = db.mainorder_model;
const BonusCollectioniModel = db.BonusCollection;
const live_priceModal = db.live_priceModal



const UpdateCompany = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const updateResult = await Company.updateMany(
      {},
      { $set: { startOfDay: startOfDay, endOfDay: endOfDay } }
    );
  } catch (err) {
    console.log("Error:", err);
  }
};

cron.schedule("1 5 * * *", () => {
  UpdateCompany();
});

let GetAdminWeeklyProfit = async () => {
  try {

    const { from, to } = getLastWeekRange();

    let GetAdmins = await user
      .find({ Role: "ADMIN", NetTransactionPercent: true })
      .select("_id NetTransaction")
      .lean();

    if (!GetAdmins || GetAdmins.length === 0) {
      return;
    }

    for (const admin of GetAdmins) {
      const results = await mainorder_model.aggregate([
        {
          $match: {
            adminid: admin._id.toString(),
            buy_type: { $ne: null },
            sell_type: { $ne: null },
            sell_time: { $gte: from, $lte: to },
          },
        },
        {
          $addFields: {
            pnl: {
              $cond: [
                { $eq: ["$signal_type", "buy_sell"] },
                {
                  $multiply: [
                    { $subtract: ["$sell_price", "$buy_price"] },
                    "$buy_qty",
                  ],
                },
                {
                  $cond: [
                    { $eq: ["$signal_type", "sell_buy"] },
                    {
                      $multiply: [
                        { $subtract: ["$sell_price", "$buy_price"] },
                        "$sell_qty",
                      ],
                    },
                    0,
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$adminid",
            totalPnL: { $sum: "$pnl" },
          },
        },
      ]);

      if (results.length > 0) {
        const totalPnL = results[0].totalPnL;
        const netTransaction = admin.NetTransaction || 0;

        if (totalPnL > 0) return; // ig totalPnL Poss

        const lossPercentage =
          totalPnL < 0 && netTransaction > 0
            ? (Math.abs(totalPnL) * netTransaction) / 100
            : null;

        const newBonus = new BonusCollectioniModel({
          admin_id: admin._id,
          user_id: admin._id,
          Bonus: Math.round(lossPercentage),
          Type: "NetTransaction",
        });

        await newBonus.save();
      }
    }
  } catch (err) {
    console.log("Error in GetAdminWeeklyProfit:", err);
  }
};

const moment = require("moment");

const getLastWeekRange = () => {
  const today = moment().startOf("day");
  const lastSunday = today.day() === 0 ? today.clone() : today.clone().day(-0); // last Sunday
  const lastMonday = lastSunday.clone().subtract(6, "days"); // last Monday
  return {
    from: lastMonday.toDate(), // e.g., Mon 00:00:00
    to: lastSunday.endOf("day").toDate(), // Sun 23:59:59
  };
};

// cron.schess

cron.schedule("30 23 * * 0", async () => {
  await GetAdminWeeklyProfit();
});




const updateLastPrice = async () => {
  try {

    const result = await live_priceModal.updateMany(
      { Mid_Price: { $exists: true } },
      [
        {
          $set: { lastprice: "$Mid_Price" }
        }
      ]
    );

    console.log(`✅ Updated ${result.modifiedCount} documents.`);

  } catch (err) {
    console.error("❌ Error updating prices:", err);

  }
};


cron.schedule("1 0 * * *", () => {
  updateLastPrice();
});
