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
    } catch (error) {
    }
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
          slstatus: true
        })
        .toArray()



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
            With_Margin:true
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
              console.log(`✅ Order for ${order.symbol} submitted. Status: ${response.status}`);
              const orderresponse = await orders.deleteOne({ _id: order._id });
            }
          } catch (error) {
            console.error(`❌ Error submitting order for ${order.symbol}:`, error.message);
          }

        }
      }


      if (openPositions && openPositions.length > 0) {
        for (const position of openPositions) {
          let commonData;

          let GetDeviceToken = await user_modal.findOne({
            _id: position?.userid,
          });
          let Exittype = position.checkSlPercent
            ? "FUND_WISE"
            : position.checkSlPercent_sl
              ? "SL"
              : "TARGET"

          if (position?.signal_type === "buy_sell") {
            commonData = {
              userid: position?.userid,
              symbol: position?.symbol,
              id: position?._id,
              price: position?.live_price,
              lot: (position?.buy_lot || 0) - (position?.sell_lot || 0),
              qty: (position?.buy_qty || 0) - (position?.sell_qty || 0),
              requiredFund:
                position?.live_price *
                ((position?.buy_qty || 0) - (position?.sell_qty || 0)),
              lotsize: position?.lotsize,
              type: "sell",
              Exittype: Exittype,
            };
          } else if (position?.signal_type == "sell_buy") {
            commonData = {
              userid: position?.userid,
              symbol: position?.symbol,
              id: position?._id,
              price: position?.live_price,
              lot: (position?.sell_lot || 0) - (position?.buy_lot || 0),
              qty: (position?.sell_qty || 0) - (position?.buy_qty || 0),
              requiredFund:
                position?.live_price *
                ((position?.sell_qty || 0) - (position?.buy_qty || 0)),
              lotsize: position?.lotsize,
              type: "buy",
              Exittype: Exittype
            };
          }

          const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.base_url + "Squareoff",
            // url: "http://localhost:8800/Squareoff",
            headers: {
              "Content-Type": "application/json",
            },
            data: commonData,
          };

          const response = await axios(config);

          if (GetDeviceToken?.DeviceToken) {
            sendPushNotification(
              GetDeviceToken?.DeviceToken,
              "Open Position",
              `Your ${position?.symbol} position is ${response.data.message} at ${position?.live_price} with ${Exittype}`,
            );
          }
        }
      } else {
      }
    } catch (error) {
      console.log("Error fetching open positions:", error.message);
    }
  }
}

// Instantiate the class
module.exports = new OpenPositions();
