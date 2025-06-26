const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const WebSocket = require("ws");
require("dotenv").config();



const PORT = 5060;
const API_KEY = "e533600bac1b5195c93e19a99b72720043ba3d79";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});




app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("✅ Tiingo WebSocket is running and Socket.IO is working!");
});


const formatNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) return num;
    return num < 50 ? parseFloat(num.toFixed(5)) : parseFloat(num.toFixed(2));
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
    } else {
        if (data[4] != null) data[4] = formatNumber(data[4]);
        if (data[5] != null) data[5] = formatNumber(data[5]);
        if (data[6] != null) data[6] = formatNumber(data[6]);
        return data;
    }
};





const initializeWebSocket = (url, tickers, type) => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
        console.log(`✅ ${type.toUpperCase()} WebSocket connected`);
        ws.send(
            JSON.stringify({
                eventName: "subscribe",
                authorization: API_KEY,
                eventData: {
                    tickers,
                    thresholdLevel: type === "forex" ? 5 : 2,
                },
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
                        // console.log("formattedData", formattedData)

                        io.emit("receive_data_forex", { data: formattedData, type });

                    }
                } else if (response.service == "fx") {
                    if (response.data[4]) {
                        const formattedData = formatPrices(response.data);


                        io.emit("receive_data_forex", { data: formattedData, type });

                    }
                }
            }
        } catch (error) {
            console.error(`❌ Error in ${type} WS message:`, error);
        }
    };

    ws.onclose = () => console.log(`⚠️ ${type.toUpperCase()} WebSocket disconnected`);
    ws.onerror = (error) => console.error(`❌ ${type.toUpperCase()} WebSocket error:`, error);
};




// Start WebSocket connections
const startSockets = () => {
    console.log("🚀 Starting Tiingo WebSocket connections...");

    initializeWebSocket(
        "wss://api.tiingo.com/fx",
        [
            "eurusd", "usdjpy", "gbpusd", "audusd", "usdcad",
            "usdchf", "nzdusd", "eurjpy", "gbpjpy", "eurgbp",
        ],
        "forex"
    );



    initializeWebSocket(
        "wss://api.tiingo.com/crypto",
        [
            "btcusd", "ethusd", "xrpusd", "solusd", "dogeusd",
            "bnbbtc", "ethxrp", "usdtusd", "usdcusd", "xauusd",
        ],
        "crypto"
    );
};

// Start Server
server.listen(PORT, () => {
    console.log(`✅ Server running on ${PORT}`);
    startSockets();
});
