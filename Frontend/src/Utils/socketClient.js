// src/socketClient.js
import { io } from "socket.io-client";
import { socket_url } from "./Config";


const socket = io(socket_url == "https://localhost:1003" ? "https://trade.tradestreet.in:1003/" : socket_url, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 10000,
});


socket.emit("join_plan", "Basic"); // or "Basic", "Premium","Standard"


export default socket;
