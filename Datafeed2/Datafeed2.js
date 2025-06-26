const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { io: clientSocket } = require("socket.io-client");
const { MongoClient } = require("mongodb");
require("dotenv").config();


const PORT = 5080;
const MONGO_URL = process.env.MONGO_URL;
const SOCKET_URL = "http://localhost:5060";

const app = express();
const server = http.createServer(app);
const serverIo = socketIo(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Socket connection is working!");
});



let Plan = process.env.PLAN || 20

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





let client, db, collection, conditions;

const initializeDatabase = async () => {
    try {
        client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
        await client.connect();
        db = client.db();
        collection = db.collection("live_prices");
        conditions = db.collection("conditions");
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};



const updateDatabase = async (data, type) => {
    try {
        const now = new Date();
        const curtime = `${now.getHours().toString().padStart(2, "0")}${now
            .getMinutes().toString().padStart(2, "0")}`;

        let bidPrice = 0;
        let askPrice = 0;

        let GetPip = pipes.find((item) => item.symbol === data[1]);
        if (!GetPip) {
            GetPip = { pip: 0.0001 };
        }

        const pipValue = GetPip.pip;

        if (type === "crypto") {
            bidPrice = Plan == 0 ? data[5] : (data[6] || 0) - (Plan * pipValue);
            askPrice = Plan == 0 ? data[8] : (data[6] || 0) + (Plan * pipValue);

            await collection.updateOne(
                { ticker: data[1] },
                {
                    $set: {
                        Ticker: data[1],
                        Date: data[2],
                        curtime,
                        Exchange: data[3],
                        Bid_Size: data[4] || 0,
                        Bid_Price: bidPrice || data[5],
                        Mid_Price: data[6] || 0,
                        Ask_Size: data[7] || 0,
                        Ask_Price: askPrice || data[8],
                    },
                },
                { upsert: true }
            );
        } else {

            bidPrice = Plan == 0 ? data[4] : (data[5] || 0) - (Plan * pipValue);
            askPrice = Plan == 0 ? data[7] : (data[5] || 0) + (Plan * pipValue);

            await collection.updateOne(
                { ticker: data[1] },
                {
                    $set: {
                        Ticker: data[1],
                        Date: data[2],
                        curtime,
                        Bid_Size: data[3] || 0,
                        Bid_Price: bidPrice || data[4],
                        Mid_Price: data[5] || 0,
                        Ask_Size: data[6] || 0,
                        Ask_Price: askPrice || data[7],
                    },
                },
                { upsert: true }
            );
        }
    } catch (error) {
        console.error("❌ DB update error:", error.message);
    }
};






const simulatePriceMovement = async (formattedData, type) => {
    const activeConditions = await conditions.find({
        symbol: { $regex: new RegExp(formattedData[1], "i") },
        isActive: true,
    }).toArray();

    if (activeConditions.length === 0) {
        await updateDatabase(formattedData, type);
        serverIo.emit("receive_data_forex", { data: formattedData, type });
        return;
    }

    for (const condition of activeConditions) {
        try {
            let UpdatedPrice = condition.logs.length === 0
                ? condition.initialPrice
                : condition.logs[condition.logs.length - 1].price


            console.log("UpdatedPrice", UpdatedPrice)

            const dropAmount = Math.abs(condition.dropThreshold * 0.1);


            let simulatedDrop = (condition.logs.length < 12)
                ? (condition.dropThreshold > 0 ? UpdatedPrice + dropAmount : UpdatedPrice - dropAmount)
                : (condition.dropThreshold > 0 ? UpdatedPrice - dropAmount : UpdatedPrice + dropAmount);

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

            serverIo.emit("receive_data_forex", { data: formattedData, type });

            const updatedCondition = await conditions.findOne({ _id: condition._id });
            if (updatedCondition.logs.length >= 22) {
                await conditions.updateOne(
                    { _id: condition._id },
                    { $set: { isActive: false, triggered: false } }
                );
                console.log(`🚫 Condition auto-closed for ${condition.symbol}`);
            }

        } catch (error) {
            console.error(`❌ Error handling condition [${condition.symbol}]:`, error.message);
        }
    }

};




const socket = clientSocket(SOCKET_URL);

socket.on("connect", () => {
    console.log("🟢 Connected to datafeed.js via Socket.IO");
});




socket.on("receive_data_forex", async ({ data, type }) => {
    try {
        await simulatePriceMovement(data, type);
    } catch (err) {
        console.error("❌ Error in receive_data_forex:", err.message);
    }
});




socket.on("disconnect", () => {
    console.log("🔌 Disconnected from datafeed.js");
});

// Start server
server.listen(PORT, async () => {
    console.log(`✅ datafeed1 listening on http://localhost:${PORT}`);
    await initializeDatabase();
});
