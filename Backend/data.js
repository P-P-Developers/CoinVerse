const { io } = require("socket.io-client");

function getPrice() {
  const socket = io("http://185.209.75.198:9000/", {
    transports: ["websocket"],
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");

    // Send initial message or subscription if needed
    // Example:
    // socket.emit('subscribe', { pair: 'BTCUSDT' });
  });

  socket.on("receive_data_forex", (data) => {
    console.log("Received price:", data);
    // You can add logic to parse or use this data
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });
}

getPrice();
