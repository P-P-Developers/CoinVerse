const express = require("express");
const cors = require("cors");

var bodyParser = require("body-parser");

require("dotenv").config();

var fs = require("fs");

const http = require("http");
const socketIo = require("socket.io");

var r;

const app = express();



var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept",
    "authorization",
  ],
};
app.use(cors(corsOpts));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

require("./Socket")(app, io);

// set port, listen for requests
const PORT = process.env.PORT || 5008;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
