// src/socketClient.js
import { io } from "socket.io-client";
import { socket_url } from "./Config";

const socket = io(socket_url, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 10000,
});


export default socket;
