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
const cookieParser = require('cookie-parser');
const helmet = require('helmet');


// Setting up CORS options
const corsOpts = {
  origin: "http://localhost:3000", // your React frontend URL
  credentials: true,               // allow cookies to be sent
  methods: ["GET", "POST"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-access-token",
  ],
};


// app.use(express.static("public"));
app.use(cors(corsOpts));
app.use(cookieParser());
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
app.use(helmet());

// Importing routes
require("./App/Routes")(app);
require("./App/Controllers/Cron/Cron");


require("./App/Controllers/common/Openposition");

// httpsserver.listen(1001)
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
});
