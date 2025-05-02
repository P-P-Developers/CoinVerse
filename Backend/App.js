"use strict";

require("dotenv").config();
const mongoConnection = require("./App/Connections/mongo_connection");
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const bodyparser = require("body-parser");
const socketIo = require("socket.io");
const axios = require("axios");

// Setting up CORS options
const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept",
    "authorization",
  ],
};

// app.use(express.static("public"));
app.use(cors(corsOpts));

// Body-parser middleware setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: "10mb", extended: true }));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});


// Importing routes
require("./App/Routes")(app);
require("./App/Controllers/Cron/Cron");


require("./App/Controllers/common/Openposition");

// httpsserver.listen(1001)
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
});
