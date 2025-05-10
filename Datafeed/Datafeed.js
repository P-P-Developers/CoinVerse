const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const http = require("http");
const socketIo = require("socket.io");
const WebSocket = require("ws");
const { MongoClient } = require("mongodb");

// Constants
const API_KEY = process.env.TIINGO_API_KEY || "e533600bac1b5195c93e19a99b72720043ba3d79";
const PORT = process.env.PORT || 5008;
const databaseURLs =
"mongodb://testing:MWQ5RP%26k5T567Gy%26Maa@185.209.75.198:27017/"

// MongoDB Variables
let client;
let db;
let collection;

// Initialize MongoDB Connection
const initializeDatabase = async () => {
  try {
    client = new MongoClient(databaseURLs, { useUnifiedTopology: true });
    await client.connect();
    db = client.db();
    collection = db.collection("live_prices");
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Utility Functions
const formatNumber = (num) => {
  if (typeof num !== "number" || isNaN(num)) return num;

  const parts = num.toString().split(".");
  const integerLength = parts[0].length;

  const precisionMap = {
    1: 5,
    2: 3,
    3: 3,
    4: 3,
    default: 2,
  };

  return parseFloat(
    num.toFixed(precisionMap[integerLength] || precisionMap.default)
  );
};

const formatPrices = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      item[4] = formatNumber(item[4]);
      item[5] = formatNumber(item[5]);
      item[6] = formatNumber(item[6]);
      item[7] = formatNumber(item[7]);
      return item;
    });
  }
  return data;
};

const updateDatabaseCrypto = async (data) => {
  try {
    if (data[5] != null && data[5] !== 0) {
      const now = new Date();
      const curtime = `${now.getHours().toString().padStart(2, "0")}${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
        
      await collection.updateOne(
        { ticker: data[1] },
        {
          $set: {
            Ticker: data[1],
            Date: data[2],
            curtime: curtime,
            Exchange: data[3],
            Bid_Size: data[4] || 0,
            Bid_Price: data[5],
            Mid_Price: data[6] || 0,
            Ask_Size: data[7] || 0,
            Ask_Price: data[8] || 0,
          },
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Error updating database:", error);
  }
};


const updateDatabaseforex = async (data) => {
  try {
    if (data[4] != null && data[4] !== 0) {
      const now = new Date();
      const curtime = `${now.getHours().toString().padStart(2, "0")}${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      await collection.updateOne(
        { ticker: data[1] },
        {
          $set: {
            Ticker: data[1],
            Date: data[2],
            curtime: curtime,
            Bid_Size: data[3] || 0,
            Bid_Price: data[4] || 0,
            Mid_Price: data[5] || 0,
            Ask_Size: data[7] || 0,
            Ask_Price: data[6] || 0,
          },
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Error updating database:", error);
  }
};

// Initialize WebSocket Connections
const initializeWebSocket = (url, tickers, type) => {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log(`${type} WebSocket connected`);
    ws.send(
      JSON.stringify({
        eventName: "subscribe",
        authorization: API_KEY,
        eventData: { tickers, thresholdLevel: type === "forex" ? 5 : 2 },
      })
    );
  };

  ws.onmessage = async (message) => {
    try {
      const response = JSON.parse(message.data);

      if (response.messageType === "A" && response.data?.length > 0) {
        if (response.service == "crypto_data") {
          if (response.data[5]) {
            const formattedData = formatPrices(response.data);

            io.emit("receive_data", { data: formattedData, type });
            await updateDatabaseCrypto(formattedData);
          }
        } else if (response.service == "fx") {
          if (response.data[4]) {
            const formattedData = formatPrices(response.data);
            io.emit("receive_data", { data: formattedData, type });
            await updateDatabaseforex(formattedData);
          }
        }
      }
    } catch (error) {
      console.error(`${type} WebSocket message handling error:`, error);
    }
  };

  ws.onclose = () => console.log(`${type} WebSocket disconnected`);
  ws.onerror = (error) => console.error(`${type} WebSocket error:`, error);
};

const startSockets = () => {
  console.log("Starting WebSocket connections...");
  initializeWebSocket(
    "wss://api.tiingo.com/fx",
    [
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
    "forex"
  );

  initializeWebSocket(
    "wss://api.tiingo.com/crypto",
    [
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
    "crypto"
  );
};

// Express App Setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", credentials: true },
});

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: [
      "authorization",
      "x-access-token",
      "Content-Type",
      "Accept",
    ],
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



  



// Create Api To check socket connection
app.get("/", (req, res) => {
  res.send("Socket connection is working!");
});


require("./Socket")(app, io); // Import routes

// Start Server
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  await initializeDatabase(); // Ensure database connection before starting
  startSockets();
});
