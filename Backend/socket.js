// wss://ws.twelvedata.com/v1/quotes/price?apikey=your_api_key
const WebSocket = require('ws');

const API_KEY = '887b21c85e464ee4844b6a3853db80b6'; // 🔑 Replace with your actual TwelveData API key

const socket = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`);

socket.on('open', () => {
  console.log('✅ Connected to TwelveData WebSocket');

  // Subscribe to a symbol (e.g., AAPL or BTC/USD)
  const message = {
  "action": "subscribe", 
  "params": {
    "symbols": "AAPL,RY,RY:TSX,EUR/USD,BTC/USD"
  }
};

  socket.send(JSON.stringify(message));
});

socket.on('message', (data) => {
  try {
    const parsed = JSON.parse(data);
    console.log("📈 Price update:", parsed);
  } catch (err) {
    console.error("❌ JSON Parse Error:", err);
  }
});

socket.on('error', (error) => {
  console.error("❌ WebSocket Error:", error);
});

socket.on('close', () => {
  console.log("🔌 Connection closed");
});



// const axios = require("axios");
// const fs = require("fs"); // File system module

// let config = {
//   method: "get",
//   maxBodyLength: Infinity,
//   url: "https://api.twelvedata.com/cryptocurrencies",
//   headers: {},
// };

// axios
//   .request(config)
//   .then((response) => {
//     // Filter for entries that include "USD" or "BTC" in the symbol
//     const filteredSymbols = response.data?.data
//       ?.filter((stock) => stock.symbol.includes("USD"))
//       .map((stock) => stock.symbol); // Extract only the symbol

//     // Print the array of symbols
//     console.log(JSON.stringify(filteredSymbols, null, 2));

//     // Save it to a file
//     fs.writeFileSync(
//       "cryptocurrencies.json",
//       JSON.stringify(filteredSymbols, null, 2)
//     );
//     console.log("📁 JSON file saved as 'cryptocurrencies.json'");
//   })
//   .catch((error) => {
//     console.error("❌ Error fetching data:", error.message);
//   });
