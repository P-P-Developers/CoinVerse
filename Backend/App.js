"use strict";

require("dotenv").config();
const mongoConnection = require("./App/Connections/mongo_connection");
const express = require("express");
const app = express();
const http = require("http");

const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

// Setting up CORS options
const corsOpts = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
};

// Middleware
app.use(cors(corsOpts));
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: "10mb", extended: true }));
app.use(helmet());

// Load routes/controllers AFTER middleware
require("./App/Routes")(app);
require("./App/Controllers/Cron/Cron");
require("./App/Controllers/common/Openposition");

// ✅ Error handler - should be AFTER routes
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ 404 handler - catch unmatched routes
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
});
