const express = require("express");
const WebSocket = require("ws");

const app = express();
const PORT = 8000;

// WebSocket and API configurations
const apiKey = "887b21c85e464ee4844b6a3853db80b6";
const route = "quotes/price";
const url = `wss://ws.twelvedata.com/v1/${route}?apikey=${apiKey}`;

// Cache for storing the latest prices
let priceCache = {};

  // "symbols": "ETH/XRP,ETH/USD,DAI/USD,XRP/USD,BNB/BTC,SOL/BTC,SOL/USD,USDC/USD,ETH/BTC,BTC/USD,EUR/USD,BTC/XRP,USDT/USD,DOGE/USD,USD/JPY,EUR/USD,JPY/USD,GBP/USD,AUD/USD,USD/CAD,USD/CHF,NZD/USD,EUR/JPY,GBP/JPY,EUR/GBP,AUD/JPY,EUR/AUD,EUR/CHF,AUD/NZD,NZD/JPY,GBP/AUD,GBP/CAD,EUR/NZD,AUD/CAD,GBP/CHF"
  // USD/JPY,ETH/XRP,ETH/USD,BTC/USD,EUR/USD,ETH/BTC

// WebSocket connection and event handling
let ws = new WebSocket(url);

ws.onopen = () => {
  console.log("Connected to WebSocket");
  
  // Subscribe to symbols
  ws.send(JSON.stringify({
    "action": "subscribe",
    "params": {
      "symbols": "DAI/USD,XRP/USD,BNB/BTC,SOL/BTC,SOL/USD,USDC/USD,BTC/XRP,USDT/USD,DOGE/USD,JPY/USD,GBP/USD,AUD/USD,USD/CAD,USD/CHF,NZD/USD,EUR/JPY,GBP/JPY,EUR/GBP,AUD/JPY,EUR/AUD,EUR/CHF,AUD/NZD,NZD/JPY,GBP/AUD,GBP/CAD,EUR/NZD,AUD/CAD,GBP/CHF"
    }
  }));
};

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    
    // Update the cache with the latest price
    if (data && data.symbol && data.price) {
      priceCache[data.symbol] = data.price;
      console.log("Received data:", data.symbol, data.price);
    }
  } catch (error) {
    console.error("Error parsing message:", error);
  }
};

ws.onerror = (error) => {
  console.error("WebSocket Error:", error);
};

ws.onclose = () => {
  console.log("WebSocket connection closed. Reconnecting...");
  setTimeout(() => {
    ws = new WebSocket(url); // Reconnect
  }, 5000); // Attempt to reconnect after 5 seconds
};

// API endpoint to get the latest prices
app.get("/api/prices", (req, res) => {
  res.json(priceCache);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
