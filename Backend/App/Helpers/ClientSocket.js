// socketClient.js
const { io } = require("socket.io-client");

// Connect to your backend server
const socket = io("http://185.209.75.198:9000/", {
  transports: ["websocket"], // force WebSocket only
  reconnection: true,        // auto reconnect
});

// Log connection
socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server:", socket.id);
});

// Listen for data
socket.on("receive_data_forex", ({ data, type }) => {
  console.log("📥 Received Data:", type);


  // Example: You can process or store this data
  // processCryptoOrForexData(data, type);
});

// Log errors
socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});
