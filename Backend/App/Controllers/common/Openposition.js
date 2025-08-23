const db = require("../../Models");
const axios = require("axios");
const open_position = db.open_position;
const orderExecutionView = db.orderExecutionView;
const user_overall_fund = db.user_overall_fund;
const orders = db.Order;

const user_modal = db.user;

const { sendPushNotification } = require("../common/firebase");

class OpenPositions {
  constructor() {
    this.startFetching();
  }

  async startFetching() {
    try {
      while (true) {
        // Delay of 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.fetchPositions();
      }
    } catch (error) {}
  }

  async fetchPositions() {
    try {
      const openPositions = await open_position
        .find({
          live_price: { $ne: null },
          $or: [
            { checkSlPercent: true },
            { checkSlPercent_sl: true },
            { checkSlPercent_target: true },
          ],
        })
        .toArray();

      const orderExecutionViewdata = await orderExecutionView
        .find({
          slstatus: true,
        })
        .toArray();

      if (orderExecutionViewdata && orderExecutionViewdata.length > 0) {
        for (const order of orderExecutionViewdata) {
          const orderData = {
            userid: order.userid,
            symbol: order.symbol,
            price: order.price,
            lot: order.lot,
            qty: order.qty,
            requiredFund: order.requiredFund,
            type: order.type,
            lotsize: order.lotsize,
            selectedOption: "Market",
            limitstopprice: order.limitstopprice,
            With_Margin: true,
          };
          const config1 = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.base_url + "users/placeorder",
            headers: {
              "Content-Type": "application/json",
            },
            data: orderData,
          };
          try {
            const response = await axios(config1);

            if (response.status === 200) {
              console.log(
                `✅ Order for ${order.symbol} submitted. Status: ${response.status}`
              );
              const orderresponse = await orders.deleteOne({ _id: order._id });
            }
          } catch (error) {
            console.error(
              `❌ Error submitting order for ${order.symbol}:`,
              error.message
            );
          }
        }
      }

      if (openPositions?.length > 0) {
        const tasks = openPositions.map(async (position) => {
          try {
            const GetDeviceToken = await user_modal.findOne({
              _id: position?.userid,
            });

            let Exittype = "TARGET"; // default
            if (position?.checkSlPercent) {
              Exittype = "FUND_WISE";
            } else if (position?.checkSlPercent_sl) {
              Exittype = "SL";
            }

            let qty, lot, type;
            if (position?.signal_type === "buy_sell") {
              qty = (position?.buy_qty || 0) - (position?.sell_qty || 0);
              lot = (position?.buy_lot || 0) - (position?.sell_lot || 0);
              type = "sell";
            } else if (position?.signal_type === "sell_buy") {
              qty = (position?.sell_qty || 0) - (position?.buy_qty || 0);
              lot = (position?.sell_lot || 0) - (position?.buy_lot || 0);
              type = "buy";
            }

            const commonData = {
              userid: position?.userid,
              symbol: position?.symbol,
              id: position?._id,
              price: position?.live_price,
              lot: lot,
              qty: Math.abs(qty), // ensure positive
              requiredFund: position?.live_price * Math.abs(qty),
              lotsize: position?.lotsize,
              type,
              Exittype,
            };

            const config = {
              method: "post",
              maxBodyLength: Infinity,
              url: process.env.base_url + "Squareoff",
              headers: { "Content-Type": "application/json" },
              data: commonData,
            };

            const response = await axios(config);

            if (GetDeviceToken?.DeviceToken) {
              sendPushNotification(
                GetDeviceToken.DeviceToken,
                "Open Position",
                `Your ${position?.symbol} position ${
                  response?.data?.message || "closed"
                } at ${position?.live_price} with ${Exittype}`
              );
            }
          } catch (err) {
            console.error(
              "Error in squareoff for position:",
              position?._id,
              err.message
            );
          }
        });

        await Promise.all(tasks); // run all in parallel
      }
    } catch (error) {
      console.log("Error fetching open positions:", error.message);
    }
  }
}

// Instantiate the class
module.exports = new OpenPositions();
