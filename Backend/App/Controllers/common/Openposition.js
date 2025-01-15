const db = require("../../Models");

const axios = require("axios");
const open_position = db.open_position;

class OpenPositions {
  constructor() {
    this.fetchPositions();
  }

  async fetchPositions() {
    try {
      while (true) {
        // Delay of 1 second between each execution
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Fetch open positions
        let openPositions = await open_position
          .find({ checkSlPercent: true })
          .toArray();
        if (openPositions && openPositions.length > 0) {
          openPositions?.forEach((position) => {
            let data;
            console.log("position", position);
            if (position?.userid == "6787568e44721dbd2c3314b5") {
              if (position?.signal_type == "buy_sell") {
                data = JSON.stringify({
                  userid: position?.userid,
                  symbol: position?.symbol,
                  id: position?._id,
                  price: position?.live_price,
                  lot: position?.buy_lot || 0 - position?.sell_lot || 0,
                  qty: position?.buy_qty || 0 - position?.sell_qty || 0,
                  requiredFund:
                    position?.live_price * position?.buy_qty -
                    (position?.buy_qty || 0 - position?.sell_qty || 0),
                  type: "sell",
                  lotsize: position?.lotsize,
                });
                console.log("sell", data);
              } else {
                data = JSON.stringify({
                  userid: position?.userid,
                  symbol: position?.symbol,
                  id: position?._id,
                  price: position?.live_price,
                  lot: position?.buy_lot || 0 - position?.sell_lot || 0,
                  qty: position?.buy_qty || 0 - position?.sell_qty || 0,
                  requiredFund:
                    position?.live_price * position?.buy_qty -
                    (position?.buy_qty || 0 - position?.sell_qty || 0),
                  type: "buy",
                  lotsize: position?.lotsize,
                });
                console.log("buy", data);
              }

              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "http://localhost:8800/Squareoff",
                headers: {
                  "Content-Type": "application/json",
                },
                data: data,
              };

              // axios.request(config)
              // .then((response) => {
              //   console.log(response.data);
              // })
              // .catch((error) => {
              //   console.log(error);
              // });
            }
          });
        }
      }
    } catch (error) {
      console.log("Error fetching open positions:", error.message);
    }
  }
}

// Instantiate the class
module.exports = new OpenPositions();
