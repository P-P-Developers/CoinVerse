"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const { findOne } = require("../../../Models/Role.model");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;


class Dashboard{

    async GetDashboardData(req, res) {
        try {
          const { parent_id } = req.body; 
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
                      $or: [{ End_Date: { $gte: new Date() } }, { End_Date: null }],
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
                      $or: [{ End_Date: { $gte: new Date() } }, { End_Date: null }],
                    },
                  },
                  { $count: "count" },
                ],
              },
            },
            {
              $project: {
                TotalEmployeCount: { $arrayElemAt: ["$TotalEmployeCount.count", 0] },
                TotalActiveEmployeCount: { $arrayElemAt: ["$TotalActiveEmployeCount.count", 0] },
                TotalUserCount: { $arrayElemAt: ["$TotalUserCount.count", 0] },
                TotalActiveUserCount: { $arrayElemAt: ["$TotalActiveUserCount.count", 0] },
              },
            },
          ]);
      
          const {
            TotalEmployeCount,
            TotalActiveEmployeCount,
            TotalUserCount,
            TotalActiveUserCount,
          } = counts[0];
      
          var Count = {
            TotalEmployeCount: TotalEmployeCount,
            TotalActiveEmployeCount: TotalActiveEmployeCount,
            TotalInActiveEmployeCount: TotalEmployeCount - TotalActiveEmployeCount,
      
            TotalUserCount: TotalUserCount,
            TotalActiveUserCount: TotalActiveUserCount,
            TotalInActiveUserCount: TotalUserCount - TotalActiveUserCount,
          };
      
          // DATA GET SUCCESSFULLY
          res.send({
            status: true,
            msg: "Get Dashboard Data",
            data: Count,
          });
        } catch (error) {
          console.log("Error getting Dashboard Data:", error);
          res.status(500).send({
            status: false,
            msg: "Internal Server Error",
          });
        }
      }
      
    
}

module.exports = new Dashboard();