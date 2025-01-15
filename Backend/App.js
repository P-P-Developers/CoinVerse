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

require("./forexSocketData")(app, io);

// Importing routes
require("./App/Routes")(app);
require("./App/Controllers/Cron/Cron");

app.get("/api/prices", async (req, res) => {
  const API_TOKEN = process.env.API_TOKEN;

  // Extract the symbol from the query parameters
  const { symbol,day } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required in the query." });
  }

  // Calculate the date range (from 50 days before yesterday to yesterday)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const startDate = new Date(yesterday);
  startDate.setDate(yesterday.getDate() - day);

  // Format dates as 'YYYY-MM-DD'
  const formatDate = (date) => date.toISOString().split("T")[0];
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(yesterday);

  // Function to fetch data from Tiingo API
  const fetchTiingoData = async () => {
    const url = `https://api.tiingo.com/tiingo/daily/${symbol}/prices?startDate=${formattedStartDate}&endDate=${formattedEndDate}&token=${API_TOKEN}`;

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is valid
      if (response.status === 200) {
        return res.status(200).json(response.data);
      } else {
        return res
          .status(response.status)
          .json({ error: `Error: Received status code ${response.status}` });
      }
    } catch (error) {
      console.log("Error fetching data:", error.message);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }
  };

  // Call the fetch function
  fetchTiingoData();
});

require("./App/Controllers/common/Openposition");

// httpsserver.listen(1001)
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
});
