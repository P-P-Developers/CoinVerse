const express = require("express");
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");
const socketIo = require("socket.io");
const { io: clientSocket } = require("socket.io-client");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const PORT = 5000;
const HTTPS_PORT = 1003;
const MONGO_URL = process.env.MONGO_URL;
const SOCKET_URL = "http://82.29.178.147:7777/";
// const SOCKET_URL = "http://185.209.75.198:7777/";


const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Socket connection is working!");
});

const credentials = {
  key: fs.readFileSync("../crt/privkey.pem", "utf8"),
  cert: fs.readFileSync("../crt/fullchain.pem", "utf8"),
};

const server = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const io = socketIo(server, { cors: { origin: "*", credentials: true } });
const ioSecure = socketIo(httpsServer, {
  cors: { origin: "*", credentials: true },
});

const socket = clientSocket(SOCKET_URL);

const setupSocketHandlers = (ioInstance) => {
  ioInstance.on("connection", (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);

    socket.on("join_plan", (plan) => {
      if (["Basic", "Standard", "Premium"].includes(plan)) {
        socket.join(plan);
        console.log(`🔗 Client ${socket.id} joined ${plan} room`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

setupSocketHandlers(io);
setupSocketHandlers(ioSecure);

const pipes = [
  // Forex
  { symbol: "audcad", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "audjpy", pip: 0.01, category: "forex", digit: 2 },
  { symbol: "audnzd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "audusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "euraud", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "eurchf", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "eurgbp", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "eurjpy", pip: 0.01, category: "forex", digit: 2 },
  { symbol: "eurnzd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "eurusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "gbpaud", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "gbpcad", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "gbpchf", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "gbpjpy", pip: 0.01, category: "forex", digit: 2 },
  { symbol: "gbpusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "jpyusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "nzdjpy", pip: 0.01, category: "forex", digit: 2 },
  { symbol: "nzdusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "usdcad", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "usdchf", pip: 0.0001, category: "forex", digit: 4 },

  // Commodity
  { symbol: "xauusd", pip: 0.01, category: "commodity", digit: 2 }, // Gold
  { symbol: "xagusd", pip: 0.01, category: "commodity", digit: 2 }, // Silver

  // Crypto
  { symbol: "bnbbtc", pip: 0.000001, category: "crypto", digit: 6 },
  { symbol: "btcusd", pip: 1, category: "crypto", digit: 3 },
  { symbol: "dogeusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "ethusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "solbtc", pip: 0.000001, category: "crypto", digit: 6 },
  { symbol: "solusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "usdtusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "xrpusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "adausd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "bchusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "suiusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "linkusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "xlmusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "shibusd", pip: 0.00000001, category: "crypto", digit: 8 },
  { symbol: "ltcusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "hbarusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "dotusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "uniusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "pepeusd", pip: 0.00000001, category: "crypto", digit: 8 },
  { symbol: "aaveusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "taousd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "aptusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "icpusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "nearusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "etcusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "ondousd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "usd1usd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "gtusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "mntusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "polusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "vetusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "kasusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "trumpusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "enausd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "skyusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "renderusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "fetusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "filusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "daiusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "usdcusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "avaxusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "bnbusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "trxusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "hypeusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "leousd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "xmrusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "usdeusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "bgbusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "piusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "okbusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "croususd", pip: 0.01, category: "crypto", digit: 2 },
];

let client, db, collection, conditions, Company;
let Basic_plan, Premium_plan, Standard_plan;

const initializeDatabase = async () => {
  const DB_NAME = process.env.DB_NAME;

  if (!DB_NAME) {
    console.error("❌ DB_NAME is not set in the environment variables.");
    return;
  }

  client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });

  await client.connect();

  db = client.db(DB_NAME);

  collection = db.collection("live_prices");
  conditions = db.collection("conditions");
  Company = db.collection("companies");

  const companyData = await Company.find(
    {},
    {
      projection: { Basic_plan: 1, Premium_plan: 1, Standard_plan: 1, _id: 0 },
    }
  ).toArray();

  Basic_plan = companyData[0]?.Basic_plan;
  Premium_plan = companyData[0]?.Premium_plan;
  Standard_plan = companyData[0]?.Standard_plan;
};

const formatNumber = (num, pipdigit=0.0001) => {
  if (typeof num !== "number" || isNaN(num)) return num;

  const factor = Math.pow(10, pipdigit);
  const result = Math.round(num * factor) / factor;

  return result.toFixed(pipdigit);
};

const updateDatabase = async (data, type) => {
  // console.log("Updating database with data:", data);
  if (data.Mid_Price === 0) return;
  await collection.updateOne(
    { ticker: data.ticker },
    { $set: data },
    { upsert: true }
  );
};

const simulatePriceMovement = async (data, type) => {
  const symbol = data[1];
  const curTime = new Date();
  const curtimeStr = `${curTime.getHours().toString().padStart(2, "0")}${curTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const activeConditions = await conditions
    .find({ symbol: new RegExp(symbol, "i"), isActive: true })
    .toArray();

  const pipObj = pipes.find((p) => p.symbol === symbol) || { pip: 0.0001 };
  const pipValue = pipObj.pip;
  const pipdigit = pipObj.digit;

  let baseMidPrice = data[type === "crypto" ? 6 : 5] || 0;
  if (baseMidPrice === 0) return;

  const makePriceData = (planOffset) => ({
    ticker: symbol,
    Date: data[2],
    curtime: curtimeStr,
    Exchange: data[3] || null,
    Bid_Size: data[4] || data[3] || 0,
    Bid_Price: formatNumber(baseMidPrice - planOffset * pipValue, pipdigit),
    Mid_Price: formatNumber(baseMidPrice, pipdigit),
    Ask_Size: data[7] || data[6] || 0,
    Ask_Price: formatNumber(baseMidPrice + planOffset * pipValue, pipdigit),
  });

  // console.log("activeConditions.length",activeConditions.length)
  if (activeConditions.length == 0) {
    const basicData = makePriceData(Basic_plan);
    const standardData = makePriceData(Standard_plan);
    const premiumData = makePriceData(Premium_plan);
    await updateDatabase(basicData, type);
    await updateDatabase(standardData, type);
    await updateDatabase(premiumData, type);
    // Emit to respective rooms
    io.to("Basic").emit("receive_data_forex", { data: basicData, type });
    io.to("Standard").emit("receive_data_forex", { data: standardData, type });
    io.to("Premium").emit("receive_data_forex", { data: premiumData, type });

    ioSecure.to("Basic").emit("receive_data_forex", { data: basicData, type });
    ioSecure
      .to("Standard")
      .emit("receive_data_forex", { data: standardData, type });
    ioSecure
      .to("Premium")
      .emit("receive_data_forex", { data: premiumData, type });

    return;
  }

  // === Condition Simulation Logic (Optional) ===
  for (const condition of activeConditions) {
    try {
      const lastPrice = condition.logs.at(-1)?.price || condition.initialPrice;
      const dropAmount = Math.abs(condition.dropThreshold * 0.1);

      const simulated =
        condition.dropThreshold > 0
          ?  condition.logs?.length < 11 ? lastPrice + dropAmount : lastPrice - dropAmount
          :condition.logs?.length < 11 ?  lastPrice - dropAmount : lastPrice + dropAmount;

      await conditions.updateOne(
        { _id: condition._id },
        {
          $set: { triggered: true },
          $push: { logs: { price: simulated, time: new Date() } },
        }
      );

      const makePriceData = (planOffset) => ({
        ticker: symbol,
        Date: data[2],
        curtime: curtimeStr,
        Exchange: data[3] || null,
        Bid_Size: data[4] || data[3] || 0,
        Bid_Price: formatNumber(simulated - planOffset * pipValue, pipdigit),

        Mid_Price: formatNumber(simulated, pipdigit),
        Ask_Size: data[7] || data[6] || 0,
        Ask_Price: formatNumber(simulated + planOffset * pipValue, pipdigit),
      });

      const basicData1 = makePriceData(Basic_plan);
      const standardData1 = makePriceData(Standard_plan);
      const premiumData1 = makePriceData(Premium_plan);

      await updateDatabase(basicData1, type);
      await updateDatabase(standardData1, type);
      await updateDatabase(premiumData1, type);
      // Emit to respective rooms
      io.to("Basic").emit("receive_data_forex", { data: basicData1, type });
      io.to("Standard").emit("receive_data_forex", {
        data: standardData1,
        type,
      });
      io.to("Premium").emit("receive_data_forex", { data: premiumData1, type });

      ioSecure
        .to("Basic")
        .emit("receive_data_forex", { data: basicData1, type });
      ioSecure
        .to("Standard")
        .emit("receive_data_forex", { data: standardData1, type });
      ioSecure
        .to("Premium")
        .emit("receive_data_forex", { data: premiumData1, type });

      const updatedCondition = await conditions.findOne({ _id: condition._id });
      if (updatedCondition.logs.length >= 22) {
        await conditions.updateOne(
          { _id: condition._id },
          { $set: { isActive: false, triggered: false } }
        );
        console.log(`🚫 Auto-closed condition for ${condition.symbol}`);
      }
    } catch (err) {
      console.error("❌ Condition processing error:", err.message);
    }
  }
};

socket.on("connect", () => {
  console.log("🟢 Connected to remote datafeed socket");
});

socket.on("receive_data_forex", async ({ data, type }) => {
  try {
    await simulatePriceMovement(data, type);
  } catch (err) {
    console.error("❌ receive_data_forex error:", err.message);
  }
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from datafeed.js");
});

// === START SERVERS ===
server.listen(PORT, async () => {
  console.log(`✅ HTTP Server running on port ${PORT}`);
  await initializeDatabase();
});

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`✅ HTTPS Server running on port ${HTTPS_PORT}`);
});
