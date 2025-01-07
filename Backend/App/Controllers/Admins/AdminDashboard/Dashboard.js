"use strict";
const db = require("../../../Models");
const User_model = db.user;

class Dashboard {
  // async GetDashboardData(req, res) {
  //   try {
  //     const { parent_id } = req.body;
  //     const counts = await User_model.aggregate([
  //       {
  //         $facet: {
  //           TotalEmployeCount: [
  //             { $match: { Role: "EMPLOYE", parent_id: parent_id } },
  //             { $count: "count" },
  //           ],
  //           TotalActiveEmployeCount: [
  //             {
  //               $match: {
  //                 Role: "EMPLOYE",
  //                 ActiveStatus: "1",
  //                 parent_id: parent_id,
  //                 $or: [{ End_Date: { $gte: new Date() } }, { End_Date: null }],
  //               },
  //             },
  //             { $count: "count" },
  //           ],
  //           TotalUserCount: [
  //             { $match: { Role: "USER", parent_id: parent_id } },
  //             { $count: "count" },
  //           ],
  //           TotalActiveUserCount: [
  //             {
  //               $match: {
  //                 Role: "USER",
  //                 ActiveStatus: "1",
  //                 parent_id: parent_id,
  //                 $or: [{ End_Date: { $gte: new Date() } }, { End_Date: null }],
  //               },
  //             },
  //             { $count: "count" },
  //           ],
  //         },
  //       },
  //       {
  //         $project: {
  //           TotalEmployeCount: {
  //             $ifNull: [{ $arrayElemAt: ["$TotalEmployeCount.count", 0] }, 0],
  //           },
  //           TotalActiveEmployeCount: {
  //             $ifNull: [
  //               { $arrayElemAt: ["$TotalActiveEmployeCount.count", 0] },
  //               0,
  //             ],
  //           },
  //           TotalUserCount: {
  //             $ifNull: [{ $arrayElemAt: ["$TotalUserCount.count", 0] }, 0],
  //           },
  //           TotalActiveUserCount: {
  //             $ifNull: [
  //               { $arrayElemAt: ["$TotalActiveUserCount.count", 0] },
  //               0,
  //             ],
  //           },
  //         },
  //       },
  //     ]);

  //     const {
  //       TotalEmployeCount,
  //       TotalActiveEmployeCount,
  //       TotalUserCount,
  //       TotalActiveUserCount,
  //     } = counts[0];

  //     var Count = {
  //       TotalEmployeCount: TotalEmployeCount,
  //       TotalActiveEmployeCount: TotalActiveEmployeCount,
  //       TotalInActiveEmployeCount: TotalEmployeCount - TotalActiveEmployeCount,
  //       TotalUserCount: TotalUserCount,
  //       TotalActiveUserCount: TotalActiveUserCount,
  //       TotalInActiveUserCount: TotalUserCount - TotalActiveUserCount,
  //     };

  //     // DATA GET SUCCESSFULLY
  //     res.send({
  //       status: true,
  //       message: "Get Dashboard Data",
  //       data: Count,
  //     });
  //   } catch (error) {
  
  //     res.status(500).send({
  //       status: false,
  //       message: "Internal Server Error",
  //     });
  //   }
  // }


  async GetDashboardData(req, res) {
    try {
      const { parent_id } = req.body;

      // Fetch total licenses for the given parent_id
      const parentData = await User_model.findOne({ _id: parent_id }, { Licence: 1 });
      const TotalLicence = parentData ? parentData.Licence || 0 : 0;

      // Fetch the sum of Licences from all Users and Employees under the parent_id
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
      res.status(500).send({
        status: false,
        message: "Internal Server Error",
      });
    }
  }


}

module.exports = new Dashboard();
