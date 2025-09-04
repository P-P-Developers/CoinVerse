"use strict";
const db = require("../../../Models");
const User_model = db.user;
const axios = require("axios");

class Dashboard {
  async GetDashboardData(req, res) {
    try {
      const { parent_id } = req.body;

      const parentData = await User_model.findOne(
        { _id: parent_id },
        { Licence: 1 }
      );
      const TotalLicence = parentData ? parentData.Licence || 0 : 0;

      const UsedLicenceData = await User_model.aggregate([
        {
          $match: {
            parent_id: parent_id,
            Role: { $in: ["USER", "EMPLOYE"] },
          },
        },
        {
          $group: {
            _id: null,
            totalUsedLicences: { $sum: "$Licence" },
          },
        },
      ]);

      const UsedLicence =
        UsedLicenceData.length > 0 ? UsedLicenceData[0].totalUsedLicences : 0;

      const counts = await User_model.aggregate([
        {
          $facet: {
            TotalEmployeCount: [
              { $match: { Role: "EMPLOYE", parent_id: parent_id } },
              { $count: "count" },
            ],
            TotalActiveEmployeCount: [
              {
                $match: {
                  Role: "EMPLOYE",
                  ActiveStatus: "1",
                  parent_id: parent_id,
                  // $or: [{ End_Date: { $gte: new Date() } }, { End_Date: null }],
                },
              },
              { $count: "count" },
            ],
            TotalUserCount: [
              { $match: { Role: "USER", parent_id: parent_id } },
              { $count: "count" },
            ],
            TotalActiveUserCount: [
              {
                $match: {
                  Role: "USER",
                  ActiveStatus: "1",
                  parent_id: parent_id,
                  // $or: [{ End_Date: { $gte: new Date() } }, { End_Date: null }],
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            TotalEmployeCount: {
              $ifNull: [{ $arrayElemAt: ["$TotalEmployeCount.count", 0] }, 0],
            },
            TotalActiveEmployeCount: {
              $ifNull: [
                { $arrayElemAt: ["$TotalActiveEmployeCount.count", 0] },
                0,
              ],
            },
            TotalUserCount: {
              $ifNull: [{ $arrayElemAt: ["$TotalUserCount.count", 0] }, 0],
            },
            TotalActiveUserCount: {
              $ifNull: [
                { $arrayElemAt: ["$TotalActiveUserCount.count", 0] },
                0,
              ],
            },
          },
        },
      ]);

      const {
        TotalEmployeCount,
        TotalActiveEmployeCount,
        TotalUserCount,
        TotalActiveUserCount,
      } = counts[0];

      const Count = {
        TotalEmployeCount: TotalEmployeCount,
        TotalActiveEmployeCount: TotalActiveEmployeCount,
        TotalInActiveEmployeCount: TotalEmployeCount - TotalActiveEmployeCount,
        TotalUserCount: TotalUserCount,
        TotalActiveUserCount: TotalActiveUserCount,
        TotalInActiveUserCount: TotalUserCount - TotalActiveUserCount,
        TotalLicence: TotalLicence,
        UsedLicence: UsedLicence,
      };

      // DATA GET SUCCESSFULLY
      res.send({
        status: true,
        message: "Get Dashboard Data",
        data: Count,
      });
    } catch (error) {
      res.send({
        status: false,
        message: "Internal Server Error",
      });
    }
  }

  async apiPrice(req, res) {
    const API_TOKEN = process.env.API_TOKEN;

    // Extract symbol and day from query
    const { symbol, day } = req.query;

    if (!symbol) {
      return res
        .status(400)
        .json({ error: "Symbol is required in the query." });
    }

    // Parse 'day' parameter, fallback to 50 if invalid or missing
    let days = parseInt(day, 10);
    if (isNaN(days) || days < 1) {
      days = 50;
    }

    // Calculate date range: from (yesterday - days) to yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startDate = new Date(yesterday);
    startDate.setDate(yesterday.getDate() - days);

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(yesterday);

    // Build Tiingo API URL
    const url = `https://api.tiingo.com/tiingo/daily/${symbol}/prices?startDate=${formattedStartDate}&endDate=${formattedEndDate}&token=${API_TOKEN}`;

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        return res.status(200).json(response.data);
      } else {
        return res
          .status(response.status)
          .json({ error: `Error: Received status code ${response.status}` });
      }
    } catch (error) {
      // Optionally log error here
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }
  }
  async apiPriceIntraday(req, res) {
    const API_TOKEN = process.env.API_TOKEN;

    // Extract symbol and day from query
    const { symbol, day } = req.query;

    if (!symbol) {
      return res
        .status(400)
        .json({ error: "Symbol is required in the query." });
    }

    // Parse 'day' parameter, fallback to 50 if invalid or missing
    let days = parseInt(day, 10);
    if (isNaN(days) || days < 1) {
      days = 50;
    }

    // Calculate date range: from (yesterday - days) to yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startDate = new Date(yesterday);
    startDate.setDate(yesterday.getDate() - days);

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(yesterday);

    const url = `https://api.tiingo.com/tiingo/crypto/prices?tickers=${symbol}&startDate=${formattedEndDate}&resampleFreq=1min&token=${API_TOKEN}`;

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        if (response.data.length > 0) {
          let ResData = response.data[0]?.priceData?.slice(-150);
          return res.json(ResData);
        }
      } else {
        return res
          .status(response.status)
          .json({ error: `Error: Received status code ${response.status}` });
      }
    } catch (error) {
      // Optionally log error here
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }
  }
}

module.exports = new Dashboard();
