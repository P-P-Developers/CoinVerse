// src/socketClient.js
import { io } from "socket.io-client";

const socket = io("http://185.209.75.198:9000/", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 10000,
});


export default socket;
