const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { io: clientSocket } = require("socket.io-client");
const { MongoClient } = require("mongodb");
require("dotenv").config();


const PORT = 5000;
const MONGO_URL = process.env.MONGO_URL;
const SOCKET_URL = "http://82.29.178.147:7777/";

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
let Plan



const initializeDatabase = async () => {
    try {
        client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
        await client.connect();
        db = client.db();
        collection = db.collection("live_prices");
        conditions = db.collection("conditions");
        Company = db.collection("companies");
        const Companydataget = await Company.find({}, { projection: { plan: 1, _id: 0 } }).toArray();
        Plan = Companydataget[0]?.plan || 20
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};






const updateDatabase = async (data, type) => {
    try {
        if (data.Mid_Price == 0) {
            return;
        }

        if (type === "crypto") {

            await collection.updateOne(
                { ticker: data.ticker },
                {
                    $set: data,
                },
                { upsert: true }
            );
        } else {

            await collection.updateOne(
                { ticker: data.ticker },
                {
                    $set: data,
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




    const now = new Date();
    const curtime = `${now.getHours().toString().padStart(2, "0")}${now
        .getMinutes().toString().padStart(2, "0")}`;

    let bidPrice = 0;
    let askPrice = 0;


    let GetPip = pipes.find((item) => item.symbol === formattedData[1]);
    if (!GetPip) {
        GetPip = { pip: 0.0001 };
    }

    const pipValue = GetPip.pip;
    let updatedata



    if (type === "crypto") {

        if (
            formattedData[5] == null ||
            formattedData[6] == null ||
            formattedData[8] == null
        ) {
            return;
        }


        bidPrice = Plan == 0 ? formattedData[5] : (formattedData[6] || 0) - (Plan * pipValue);
        askPrice = Plan == 0 ? formattedData[8] : (formattedData[6] || 0) + (Plan * pipValue);


        updatedata = {
            ticker: formattedData[1],
            Date: formattedData[2],
            curtime,
            Exchange: formattedData[3],
            Bid_Size: formattedData[4] || 0,
            Bid_Price: bidPrice || formattedData[5],
            Mid_Price: formattedData[6] || 0,
            Ask_Size: formattedData[7] || 0,
            Ask_Price: askPrice || formattedData[8],
        }


    } else {

        if (
            formattedData[4] == null ||
            formattedData[7] == null ||
            formattedData[5] == null
        ) {
            return;
        }

        bidPrice = Plan == 0 ? formattedData[4] : (formattedData[5] || 0) - (Plan * pipValue);
        askPrice = Plan == 0 ? formattedData[7] : (formattedData[5] || 0) + (Plan * pipValue);
        updatedata = {
            ticker: formattedData[1],
            Date: formattedData[2],
            curtime,
            Bid_Size: formattedData[3] || 0,
            Bid_Price: bidPrice || formattedData[4],
            Mid_Price: formattedData[5] || 0,
            Ask_Size: formattedData[6] || 0,
            Ask_Price: askPrice || formattedData[7],
        }

    }







    if (activeConditions.length === 0) {
        await updateDatabase(updatedata, type);
        serverIo.emit("receive_data_forex", { data: updatedata, type });
        return;
    }

    for (const condition of activeConditions) {
        try {
            let UpdatedPrice = condition.logs.length === 0
                ? condition.initialPrice
                : condition.logs[condition.logs.length - 1].price
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


            updatedata.Mid_Price = simulatedDrop;
            updatedata.Mid_Price = simulatedDrop;


            await updateDatabase(updatedata, type);

            serverIo.emit("receive_data_forex", { data: updatedata, type });

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
    console.log(`✅ datafeed1 listening on ${PORT}`);
    await initializeDatabase();
});
