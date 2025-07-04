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


const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Socket connection is working!");
});




// const credentials = {
//     key: fs.readFileSync("../crt/privkey.pem", "utf8"),
//     cert: fs.readFileSync("../crt/fullchain.pem", "utf8"),
// };




const server = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);



const io = socketIo(server, { cors: { origin: "*", credentials: true } });
// const ioSecure = socketIo(httpsServer, { cors: { origin: "*", credentials: true } });




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
// setupSocketHandlers(ioSecure);


let pipes = [
    { "symbol": "usdtusd", "pip": 0.0001 },
    { "symbol": "btcxrp", "pip": 0.00001 },
    { "symbol": "btcusd", "pip": 0.01 },
    { "symbol": "ethxrp", "pip": 0.00001 },
    { "symbol": "ethusd", "pip": 0.01 },
    { "symbol": "usdcusd", "pip": 0.0001 },
    { "symbol": "solusd", "pip": 0.001 },
    { "symbol": "solbtc", "pip": 0.000001 },
    { "symbol": "bnbbtc", "pip": 0.000001 },
    { "symbol": "xrpusd", "pip": 0.0001 },
    { "symbol": "daiusd", "pip": 0.0001 },
    { "symbol": "dogeusd", "pip": 0.00001 },
    { "symbol": "xauusd", "pip": 0.01 },
    { "symbol": "audcad", "pip": 0.0001 },
    { "symbol": "audjpy", "pip": 0.01 },
    { "symbol": "audnzd", "pip": 0.0001 },
    { "symbol": "audusd", "pip": 0.0001 },
    { "symbol": "euraud", "pip": 0.0001 },
    { "symbol": "eurchf", "pip": 0.0001 },
    { "symbol": "eurgbp", "pip": 0.0001 },
    { "symbol": "eurjpy", "pip": 0.01 },
    { "symbol": "eurnzd", "pip": 0.0001 },
    { "symbol": "eurusd", "pip": 0.0001 },
    { "symbol": "gbpaud", "pip": 0.0001 },
    { "symbol": "gbpcad", "pip": 0.0001 },
    { "symbol": "gbpchf", "pip": 0.0001 },
    { "symbol": "gbpjpy", "pip": 0.01 },
    { "symbol": "gbpusd", "pip": 0.0001 },
    { "symbol": "jpyusd", "pip": 0.0001 },
    { "symbol": "nzdjpy", "pip": 0.01 },
    { "symbol": "nzdusd", "pip": 0.0001 },
    { "symbol": "usdcad", "pip": 0.0001 },
    { "symbol": "usdchf", "pip": 0.01 },
    { "symbol": "xauusd", "pip": 0.01 },
    { "symbol": "wtiousd", "pip": 0.01 },
    { "symbol": "brentusd", "pip": 0.001 },
    { "symbol": "natgasusd", "pip": 0.0001 },
    { "symbol": "rbobusd", "pip": 0.0001 },
    { "symbol": "heatoilusd", "pip": 0.0001 },
    { "symbol": "propaneusd", "pip": 0.01 },
    { "symbol": "coalusd", "pip": 0.01 },
    { "symbol": "uraniumusd", "pip": 0.0001 },
    { "symbol": "ethanolusd", "pip": 0.01 },
    { "symbol": "electricityusd", "pip": 0.01 },
    { "symbol": "xagusd", "pip": 0.01 },
    { "symbol": "krwusd", "pip": 0.01 }
]



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


    const companyData = await Company.find({}, {
        projection: { Basic_plan: 1, Premium_plan: 1, Standard_plan: 1, _id: 0 }
    }).toArray();

    Basic_plan = companyData[0]?.Basic_plan;
    Premium_plan = companyData[0]?.Premium_plan;
    Standard_plan = companyData[0]?.Standard_plan;
};



// const formatNumber = (num) => {
//   if (typeof num !== "number" || isNaN(num)) return num;

//   return num < 50 ? parseFloat(num.toFixed(6)) : parseFloat(num.toFixed(6));
// };


const formatNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) return num;
    const factor = num < 50 ? 1e5 : 1e2;
    const result = Math.round(num * factor) / factor;
    // console.log("result", result)
    return result;
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


const updateDatabase = async (data, type) => {
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
    const curtimeStr = `${curTime.getHours().toString().padStart(2, "0")}${curTime.getMinutes().toString().padStart(2, "0")}`;
    const activeConditions = await conditions.find({ symbol: new RegExp(symbol, "i"), isActive: true }).toArray();

    const pipObj = pipes.find(p => p.symbol === symbol) || { pip: 0.0001 };
    const pipValue = pipObj.pip;

    let baseMidPrice = data[type === "crypto" ? 6 : 5] || 0;
    if (baseMidPrice === 0) return;

    const makePriceData = (planOffset) => ({
        ticker: symbol,
        Date: data[2],
        curtime: curtimeStr,
        Exchange: data[3] || null,
        Bid_Size: data[4] || data[3] || 0,
        Bid_Price: baseMidPrice - planOffset * pipValue,
        Mid_Price: baseMidPrice,
        Ask_Size: data[7] || data[6] || 0,
        Ask_Price: baseMidPrice + planOffset * pipValue,
    });

    const basicData = makePriceData(Basic_plan);
    const standardData = makePriceData(Standard_plan);
    const premiumData = makePriceData(Premium_plan);




    if (activeConditions.length == 0) {
        await updateDatabase(basicData, type);
        await updateDatabase(standardData, type);
        await updateDatabase(premiumData, type);
        // Emit to respective rooms
        io.to("Basic").emit("receive_data_forex", { data: basicData, type });
        io.to("Standard").emit("receive_data_forex", { data: standardData, type });
        io.to("Premium").emit("receive_data_forex", { data: premiumData, type });

        // ioSecure.to("Basic").emit("receive_data_forex", { data: basicData, type });
        // ioSecure.to("Standard").emit("receive_data_forex", { data: standardData, type });
        // ioSecure.to("Premium").emit("receive_data_forex", { data: premiumData, type });

        return;
    }

    // === Condition Simulation Logic (Optional) ===
    for (const condition of activeConditions) {
        try {
            const lastPrice = condition.logs.at(-1)?.price || condition.initialPrice;
            const dropAmount = Math.abs(condition.dropThreshold * 0.1);

            const simulated = condition.dropThreshold > 0
                ? lastPrice + dropAmount
                : lastPrice - dropAmount;

            await conditions.updateOne(
                { _id: condition._id },
                {
                    $set: { triggered: true },
                    $push: { logs: { price: simulated, time: new Date() } }
                }
            );


            const simData = { ...premiumData, Mid_Price: simulated };


            const makePriceData = (planOffset) => ({
                ticker: symbol,
                Date: data[2],
                curtime: curtimeStr,
                Exchange: data[3] || null,
                Bid_Size: data[4] || data[3] || 0,
                Bid_Price: simulated - planOffset * pipValue,
                Mid_Price: simulated,
                Ask_Size: data[7] || data[6] || 0,
                Ask_Price: simulated + planOffset * pipValue,
            });

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

            // ioSecure.to("Basic").emit("receive_data_forex", { data: basicData, type });
            // ioSecure.to("Standard").emit("receive_data_forex", { data: standardData, type });
            // ioSecure.to("Premium").emit("receive_data_forex", { data: premiumData, type });

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
        const formattedData = formatPrices(data);
        await simulatePriceMovement(formattedData, type);
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

// httpsServer.listen(HTTPS_PORT, () => {
//     console.log(`✅ HTTPS Server running on port ${HTTPS_PORT}`);
// });
