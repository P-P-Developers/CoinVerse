const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const http = require("http");
const socketIo = require("socket.io");
const WebSocket = require("ws");
const { MongoClient } = require("mongodb");
const dbdata = require("../Backend/App/Models");
const Symbol = db.Symbol;



// Constants
// const API_KEY = process.env.API_TOKEN;
const API_KEY = "6c89bf7d4e3c6d0e1eff47ad7c8f8b5781ee990b"; // Replace with your actual API key

const PORT = process.env.PORT || 9000;
const databaseURLs = process.env.MONGO_URL;

// MongoDB Variables
let client;
let db;
let collection;
let conditions;

// Initialize MongoDB Connection
const initializeDatabase = async () => {
  try {
    client = new MongoClient(databaseURLs, { useUnifiedTopology: true });
    await client.connect();
    db = client.db();
    collection = db.collection("live_prices");
    conditions = db.collection("conditions");

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
};
const simulatePriceMovement = async (formattedData, type, typ) => {
  const activeConditions = await conditions
    .find({
      symbol: { $regex: new RegExp(formattedData[1], "i") }, // "i" = case-insensitive
      isActive: true,
    })
    .toArray();

  if (activeConditions.length === 0) {
    io.emit("receive_data_forex", { data: formattedData, type });
    if (typ == 1) {
      await updateDatabaseCrypto(formattedData);
    } else {
      await updateDatabaseCrypto(formattedData);
    }
    return;
  }
  const now = new Date();

  for (const condition of activeConditions) {
    let UpdatedPrice =
      condition.logs.length == 0
        ? condition.initialPrice
        : condition.logs[condition.logs.length - 1].price;

    const dropAmount = Math.abs(condition.dropThreshold * 0.1); // 10% of threshold
    let simulatedDrop;

    if (condition.logs.length < 12)
      simulatedDrop =
        condition.dropThreshold > 0
          ? UpdatedPrice + dropAmount
          : UpdatedPrice - dropAmount;
    else {
      simulatedDrop =
        condition.dropThreshold > 0
          ? UpdatedPrice - dropAmount
          : UpdatedPrice + dropAmount;
    }

    // Step 1: Push log entries and set `triggered: true`
    await conditions.updateOne(
      { _id: condition._id },
      {
        $set: {
          triggered: true,
        },
        $push: {
          logs: {
            $each: [{ price: simulatedDrop, time: new Date() }],
          },
        },
      }
    );

    formattedData[4] = simulatedDrop;
    formattedData[5] = simulatedDrop;

    io.emit("receive_data_forex", { data: formattedData, type });
    if (typ == 1) {
      await updateDatabaseCrypto(formattedData);
    } else {
      await updateDatabaseCrypto(formattedData);
    }

    // Step 2: Get updated document to check logs count
    const updatedCondition = await conditions.findOne({ _id: condition._id });

    if (updatedCondition.logs.length >= 22) {
      // Step 3: Auto-close condition
      await conditions.updateOne(
        { _id: condition._id },
        {
          $set: {
            isActive: false,
            triggered: false,
          },
        }
      );
    }


  }
};

// Utility Functions
const formatNumber = (num) => {
  if (typeof num !== "number" || isNaN(num)) return num;

  return num < 50 ? parseFloat(num.toFixed(5)) : parseFloat(num.toFixed(2));
};

const formatPrices = (data) => {
  if (Array.isArray(data)) {
    data.map((item) => {
      item[4] = formatNumber(item[4]);
      item[5] = formatNumber(item[5]);
      item[6] = formatNumber(item[6]);
      item[7] = formatNumber(item[7]);
      return item;
    });
  }
  if (data[4] != null && data[4] !== 0) {
    data[4] = formatNumber(data[4]);
  }
  if (data[5] != null && data[5] !== 0) {
    data[5] = formatNumber(data[5]);
  }
  if (data[6] != null && data[6] !== 0) {
    data[6] = formatNumber(data[6]);
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
  } catch (error) { }
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
  } catch (error) { }
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
            // console.log("crypto_data 5:", formattedData);
            let getConditionsData = await simulatePriceMovement(
              formattedData,
              type,
              1
            );

            // io.emit("receive_data_forex", { data: formattedData, type });
            // await updateDatabaseCrypto(formattedData);
          }
        } else if (response.service == "fx") {
          if (response.data[4]) {
            const formattedData = formatPrices(response.data);
            let getConditionsData = await simulatePriceMovement(
              formattedData,
              type,
              2
            );

            // io.emit("receive_data_forex", { data: formattedData, type });
            // await updateDatabaseforex(formattedData);
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
      "xauusd",
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
      "xauusd",
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

// require("./Socket")(app, io); // Import routes

// Start Server
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  await initializeDatabase(); // Ensure database connection before starting
  startSockets();
});
