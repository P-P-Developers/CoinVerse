module.exports = function (app, io) {
  const WebSocket = require("ws");

  const API_KEY = "f63ec5fbc480c499640b7c880982fb65213326a9";
  const formatNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) {
      return num; // Return as is if not a valid number
    }

    const parts = num.toString().split("."); // Split the number into integer and fractional parts
    const integerLength = parts[0].length;

    if (integerLength === 1) {
      return parseFloat(num.toFixed(5)); // 1 digit before decimal -> 5 digits after
    } else if (integerLength === 2) {
      return parseFloat(num.toFixed(3)); // 2 digits before decimal -> 3 digits after
    } else if (integerLength === 3) {
      return parseFloat(num.toFixed(3)); // 2 digits before decimal -> 3 digits after
    } else if (integerLength === 4) {
      return parseFloat(num.toFixed(3)); // 2 digits before decimal -> 3 digits after
    } else if (integerLength >= 5) {
      return parseFloat(num.toFixed(2)); // 5 or more digits before decimal -> 2 digits after
    } else {
      return num; // Default case, return as is
    }
  };

  const formatPrices = (item) => {
    if (Array.isArray(item)) {
      item[4] = formatNumber(item[4]);
      item[5] = formatNumber(item[5]);
      item[6] = formatNumber(item[6]);
      item[7] = formatNumber(item[7]);
    }

    return item;
  };

  const forexSocket = () => {
    const ws = new WebSocket("wss://api.tiingo.com/fx");

    ws.onopen = () => {
      const subscribeMessage = {
        eventName: "subscribe",
        authorization: API_KEY,
        eventData: {
          thresholdLevel: 5,
          tickers: [
            "eurusd",
            "jpyusd",
            "usdjpy",
            "gbpusd",
            "audusd",
            "usdcad",
            "usdchf",
            "nzdusd",
            "eurjpy",
            "gbpjpy",
            "eurgbp",
            "audjpy",
            "euraud",
            "eurchf",
            "audnzd",
            "nzdjpy",
            "gbpaud",
            "gbpcad",
            "eurnzd",
            "audcad",
            "gbpchf",
            "xauusd"
          ],
        },
      };

      ws.send(JSON.stringify(subscribeMessage));
    };

    ws.onmessage = (data) => {
      const response = JSON.parse(data.data);

      if (response.messageType === "A" && response.data?.length > 0) {
        const formattedData = formatPrices(response.data);

        io.emit("receive_data_forex", { data: formattedData, type: "forex" });
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from Tiingo FX WebSocket");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  };

  const cryptoSocket = () => {
    const ws = new WebSocket("wss://api.tiingo.com/crypto");

    ws.onopen = () => {
      const subscribeMessage = {
        eventName: "subscribe",
        authorization: API_KEY,
        eventData: {
          thresholdLevel: 2,
          tickers: [
            "usdtusd",
            "btcxrp",
            "btcusd",
            "ethxrp",
            "ethusd",
            "usdcusd",
            "solusd",
            "solbtc",
            "bnbbtc",
            "xrpusd",
            "daiusd",
            "dogeusd",
          ],
        },
      };

      ws.send(JSON.stringify(subscribeMessage));
    };

    ws.onmessage = (data) => {
      const response = JSON.parse(data.data);

      if (response.messageType === "A" && response.data?.length > 0) {
        const formattedData = formatPrices(response.data);

        if(formattedData?.includes("undefined") ||  formattedData?.includes(undefined) || formattedData?.includes(null) || formattedData?.includes("null")){ 
          return
        }

        io.emit("receive_data_forex", { data: formattedData, type: "crypto" });
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from Tiingo Crypto WebSocket");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  };

  async function startSockets() {
    console.log("Starting WebSocket connections");
    forexSocket();
    cryptoSocket();
  }

  startSockets();
};
