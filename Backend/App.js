"use strict";

require("dotenv").config();
const mongoConnection = require("./App/Connections/mongo_connection");
const express = require("express");
const app = express();
const http = require("http");
const winston = require("winston");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "*"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Setting up CORS options
const corsOpts = {
  origin: ["http://localhost:3001", "*"],
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

const logger = winston.createLogger({
  level: "warn",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: "slow-requests.log" }),
    new winston.transports.Console(),
  ],
});

// ✅ Request timing logger (Move it here)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (duration > 200) {
      logger.warn(
        `SLOW API: [${req.method}] ${req.originalUrl} - ${duration}ms`
      );
    }
  });
  next();
});

// Load routes/controllers AFTER middleware
require("./App/Routes")(app);
require("./App/Controllers/Cron/Cron");
require("./App/Controllers/common/Openposition");

// ✅ Error handler - should be AFTER routes
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.json({ error: "Internal Server Error" });
});

// ✅ 404 handler - catch unmatched routes
app.use((req, res) => {
  res.send("Not Found");
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
});
