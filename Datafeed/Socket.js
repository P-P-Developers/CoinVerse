module.exports = function (app, io) {
    const WebSocket = require("ws");

    const API_KEY = 'e7edf7d2974a17556ee79ce31330b8536b3338e0';
  

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
            ],
          },
        };
  
        ws.send(JSON.stringify(subscribeMessage));
      };
  
      ws.onmessage = (data) => {
        const response = JSON.parse(data.data);
  
        if (response.messageType === "A" && response.data?.length > 0) {
          const dataType = response.data[0];
   
          if (dataType === "Q") {
            io.emit("receive_data_forex", { data: response.data, type: "forex" });
          }
       
   
        }
      };
  
      ws.onclose = () => {
        console.log("Disconnected from Tiingo FX WebSocket");
      };
  
      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };
  
    // WebSocket handler for Crypto data
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
          const dataType = response.data[0];
          if (dataType === "Q" || dataType === "T") {
            io.emit("receive_data_forex", {
              data: response.data,
              type: "crypto",
            });
          }
        
        }
      };
  
      ws.onclose = () => {
        console.log("Disconnected from Tiingo Crypto WebSocket");
      };
  
      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };
  
    // Start both Forex and Crypto WebSocket connections
    async function startSockets() {
      console.log("Starting WebSocket connections");
      forexSocket();
      cryptoSocket();
    }
  
    startSockets();
  };
  