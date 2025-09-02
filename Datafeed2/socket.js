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
const SOCKET_URL = "http://185.209.75.198:7777/";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Socket connection is working!");
});



const server = http.createServer(app);
const httpsServer = https.createServer( app);



const socket = clientSocket(SOCKET_URL);







socket.on("connect", () => {
  console.log("🟢 Connected to remote datafeed socket");
});

socket.on("receive_data_forex", async ({ data, type }) => {
  try {
  console.log("📥 receive_data_forex event received",data);
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

});

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`✅ HTTPS Server running on port ${HTTPS_PORT}`);
});
