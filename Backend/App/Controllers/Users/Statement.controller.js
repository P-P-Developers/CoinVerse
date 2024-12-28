"use strict";
const db = require("../../Models");
const Order = db.Order;

class statement {
  async statement(req, res) {
    try {
      const data = await Order.find({ userid: req.body.userid }).sort({
        createdAt: -1,
      });

      const result = data.map((item) => ({
        Symbol: item.symbol,
        price: item.price,
        type: item.type,
        qty: item.qty,
        lot: item.lot,
        brokerage: item.brokerage,
        requiredFund: item.requiredFund,
        createdAt: item.createdAt,
        status: item.status,
      }));

      if (result.length === 0) {
        return res.json({ status: false, message: "not found", data: [] });
      }

      return res.json({ status: true, message: "success", data: result });
    } catch (err) {
      res.json({ status: false, message: "internal error", data: [] });
    }
  }
}

module.exports = new statement();
