// src/socketClient.js
import { io } from "socket.io-client";

const protocol = window.location.protocol === "https:" ? "https" : "http";
console.log("Socket protocol:", protocol);
const socketURL = `${protocol}://185.209.75.198:9000/`;

const socket = io(socketURL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 10000,
  rejectUnauthorized: false, // only needed for self-signed certs
});

export default socket;
