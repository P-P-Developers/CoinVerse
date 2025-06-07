const db = require("../../../Models");
const User_model = db.user;
const Condition = require("../../../Models/Tradelogs.model");
const live_priceModal = db.live_priceModal;

class CommanApis {
  async GetAdminUserName(req, res) {
    try {
      const { parent_id } = req.body;
      const adminNames = await User_model.findAll({
        where: {
          parent_id: parent_id,
        },
      });
      return res.status(200).json(adminNames);
    } catch (error) {
      console.error("Error fetching admin names:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async AddCondition(req, res) {
    try {
      const { userId, symbol, initialPrice, dropThreshold, timeWindow } =
        req.body;

      if (!userId || !symbol || !dropThreshold || !timeWindow) {
        return res
          .status(400)
          .json({ status: false, message: "Missing required fields" });
      }

      const normalizedSymbol = symbol.toLowerCase();

      var initialPriceAc;

      if (!initialPrice) {
        let livePrice = await live_priceModal.findOne({
          ticker: normalizedSymbol,
        });
        const livePriceData = livePrice.toObject(); // cleaner

        initialPriceAc = livePriceData.Bid_Price;
      } else {
        initialPriceAc = initialPrice;
      }

      const condition = new Condition({
        userId,
        symbol: normalizedSymbol,
        initialPrice: initialPriceAc,
        dropThreshold,
        timeWindow,
      });

      await condition.save();

      res.status(201).json({
        status: true,
        message: "Condition created successfully",
        condition,
      });
    } catch (err) {
      console.error("AddCondition Error:", err);
      res.status(500).json({ status: false, error: err.message });
    }
  }

  async GetConditions(req, res) {
    try {
      const conditions = await Condition.find().sort({ createdAt: -1 });
      res.status(200).json({
        status: true,
        data: conditions,
        message: "Conditions fetched successfully",
      });
    } catch (err) {
      res.status(500).json({
        data: err.message,
        status: false,
        message: "Error fetching conditions",
      });
    }
  }
}
module.exports = new CommanApis();
