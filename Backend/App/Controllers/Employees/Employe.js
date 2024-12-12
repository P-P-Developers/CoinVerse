"use strict";
const db = require("../../Models");
const User_model = db.user;
const mainorder_model = db.mainorder_model;
const employee_permission = db.employee_permission;

class employee {
  // get employee user dashboard data
  async GetEmployeeUserDashboardData(req, res) {
    try {
      const { parent_id } = req.body;

      const counts = await User_model.aggregate([
        {
          $facet: {
            TotalEmployeUserCount: [
              { $match: { Role: "USER", employee_id: parent_id } },
              { $count: "count" },
            ],
            TotalActiveEmployeUserCount: [
              {
                $match: {
                  Role: "USER",
                  ActiveStatus: "1",
                  employee_id: parent_id,
                  $or: [{ End_Date: { $gte: new Date() } }, { End_Date: null }],
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            TotalEmployeUserCount: {
              $ifNull: [
                { $arrayElemAt: ["$TotalEmployeUserCount.count", 0] },
                0,
              ],
            },
            TotalActiveEmployeUserCount: {
              $ifNull: [
                { $arrayElemAt: ["$TotalActiveEmployeUserCount.count", 0] },
                0,
              ],
            },
          },
        },
      ]);

      const { TotalEmployeUserCount, TotalActiveEmployeUserCount } = counts[0];

      const Count = {
        TotalEmployeUserCount,
        TotalActiveEmployeUserCount,
        TotalInActiveEmployeUserCount:
          TotalEmployeUserCount - TotalActiveEmployeUserCount,
      };

      res.send({
        status: true,
        msg: "Get Dashboard Data",
        data: Count,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        msg: "Internal Server Error",
      });
    }
  }

  // get admin detail for employee
  async getEmployeedata(req, res) {
    try {
      const { id } = req.body;

      const result = await User_model.find({ employee_id: id });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "getting data",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  async getEmployee_permissiondata(req, res) {
    try {
      const { id } = req.body;

      const result = await employee_permission.find({ employee_id: id });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "getting data",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  async getEmployeeUserHistory(req, res) {
    try {
      const { employee_id } = req.body;
      const result = await User_model.find({ employee_id: employee_id });

      return res.json({
        status: true,
        message: "Successfully fetched data",
        data: result,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error", data: [] });
    }
  }

  // get employee user position
  async getEmployeeUserposition(req, res) {
    try {
      const { userid } = req.body;

      const users = await User_model.find({ employee_id: userid });

      if (!users.length) {
        return res.json({
          message: "No users found for the given employee_id",
        });
      }

      const userIds = users.map((user) => user._id);
      const result1 = await mainorder_model.find({ userid: { $in: userIds } });

      return res.json({ data: result1 });
    } catch (error) {
      return res.json({ message: "Internal server error" });
    }
  }

}

module.exports = new employee();
