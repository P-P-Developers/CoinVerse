"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const { findOne } = require("../../../Models/Role.model");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const totalLicense = db.totalLicense;
const MarginRequired = db.MarginRequired;
const BalanceStatement = db.BalanceStatement;
const employee_permission = db.employee_permission;
const mainorder_model = db.mainorder_model;
const ProfitmarginData = db.Profitmargin;
const crypto = require("crypto");


class Superadmin {
//   async AddAdmin(req, res) {
//     try {
//       const {
//         FullName,
//         UserName,
//         Email,
//         PhoneNo,
//         parent_id,
//         parent_role,
//         password,
//         Otp,
//         Role,
//         Licence,
//         pertrade,
//         perlot,
//         turn_over_percentage,
//         brokerage,
//         limit,
//         Employee_permission,
//         ProfitMargin,
//       } = req.body;

//       if (!FullName || !UserName || !Email || !PhoneNo || !password || !Role) {
//         return res
//           .status(400)
//           .json({ status: false, message: "Missing required fields" });
//       }

//       const existingUser = await User_model.findOne({
//         $or: [{ UserName }, { Email }, { PhoneNo }],
//       });

//       if (existingUser) {
//         if (existingUser.UserName === UserName) {
//           return res.json({
//             status: false,
//             message: "Username already exists",
//           });
//         }

//         if (existingUser.Email === Email) {
//           return res.json({ status: false, message: "Email already exists" });
//         }

//         if (existingUser.PhoneNo === PhoneNo) {
//           return res.json({
//             status: false,
//             message: "Phone Number already exists",
//           });
//         }
//       }

//       // Current date as start date
//       const startDate = new Date();
//       let endDate = new Date(startDate);
//       endDate.setMonth(endDate.getMonth() + Number(Licence));

//       if (endDate.getDate() < startDate.getDate()) {
//         endDate.setDate(0);
//       }

//       // // Fetch dollar price data
//       // const dollarPriceData = await MarginRequired.findOne({adminid:parent_id }).select("dollarprice");
//       // if (!dollarPriceData) {
//       //   return res.json({ status: false, message: "Dollar price data not found" });
//       // }

//       // // Calculate dollar count
//       // const dollarcount = (Balance / dollarPriceData.dollarprice).toFixed(3);

//       // Hash password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password.toString(), salt);

//       const activeStatus = parent_role === "EMPLOYE" ? 0 : 1;

//       // Create new user
//       const newUser = new User_model({
//         FullName,
//         UserName,
//         Email,
//         PhoneNo,
//         parent_id,
//         parent_role,
//         Otp: password,
//         Role,
//         pertrade,
//         perlot,
//         turn_over_percentage,
//         brokerage,
//         limit,
//         Licence,
//         password: hashedPassword,
//         Start_Date: startDate,
//         End_Date: endDate,
//         ActiveStatus: activeStatus,
//         ProfitMargin: ProfitMargin,
//       });

//       await newUser.save();

//       // // Create user wallet
//       // const userWallet = new Wallet_model({
//       //   user_Id: newUser._id,
//       //   Balance: dollarcount,
//       //   parent_Id: parent_id
//       // });
//       // await userWallet.save();

//       let licence = new totalLicense({
//         user_Id: newUser._id,
//         Licence: Licence,
//         parent_Id: parent_id,
//         Start_Date: startDate,
//         End_Date: endDate,
//       });

//       await licence.save();

//       if (Employee_permission) {
//         const {
//           Edit,
//           trade_history,
//           open_position,
//           Licence_Edit,
//           pertrade_edit,
//           perlot_edit,
//           limit_edit,
//           Balance_edit,
//         } = Employee_permission;

//         const newPermission = new employee_permission({
//           employee_id: newUser._id,
//           Edit,
//           trade_history,
//           open_position,
//           Licence_Edit,
//           pertrade_edit,
//           perlot_edit,
//           limit_edit,
//           Balance_edit,
//         });

//         await newPermission.save();
//       }

//       return res.json({
//         status: true,
//         message: "User added successfully",
//         data: newUser,
//       });
//     } catch (error) {
//       console.error(error);
//       return res.json({
//         status: false,
//         message: "Failed to add user",
//         data: [],
//       });
//     }
//   }

// -----------------Testing------------

async AddAdmin(req, res) {
  try {
    const {
      FullName,
      UserName,
      Email,
      PhoneNo,
      parent_id,
      parent_role,
      password,
      Otp,
      Role,
      Licence,
      pertrade,
      perlot,
      turn_over_percentage,
      brokerage,
      limit,
      Employee_permission,
      ProfitMargin,
    } = req.body;

    if (!FullName || !UserName || !Email || !PhoneNo || !password || !Role) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const existingUser = await User_model.findOne({
      $or: [{ UserName }, { Email }, { PhoneNo }],
    });

    if (existingUser) {
      if (existingUser.UserName === UserName) {
        return res.json({
          status: false,
          message: "Username already exists",
        });
      }

      if (existingUser.Email === Email) {
        return res.json({ status: false, message: "Email already exists" });
      }

      if (existingUser.PhoneNo === PhoneNo) {
        return res.json({
          status: false,
          message: "Phone Number already exists",
        });
      }
    }

    // adding referal code //new added
    const referralCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a 6-character referral code

    // Current date as start date
    const startDate = new Date();
    let endDate = new Date(startDate);
    // endDate.setMonth(endDate.getMonth() + Number(Licence));
    endDate.setMonth(endDate.getMonth() + Number(12));


    if (endDate.getDate() < startDate.getDate()) {
      endDate.setDate(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    const activeStatus = parent_role === "EMPLOYE" ? 0 : 1;

    // Create new user
    const newUser = new User_model({
      FullName,
      UserName,
      Email,
      PhoneNo,
      parent_id,
      parent_role,
      Otp: password,
      Role,
      pertrade,
      perlot,
      turn_over_percentage,
      brokerage,
      limit,
      Licence,
      password: hashedPassword,
      Start_Date: startDate,
      End_Date: endDate,
      ActiveStatus: activeStatus,
      ProfitMargin: ProfitMargin,
      ReferralCode: referralCode,  // Add referral code to the user
    });

    await newUser.save();

    // Create user wallet (if needed)
    // const userWallet = new Wallet_model({
    //   user_Id: newUser._id,
    //   Balance: dollarcount,
    //   parent_Id: parent_id
    // });
    // await userWallet.save();

    let licence = new totalLicense({
      user_Id: newUser._id,
      Licence: Licence,
      parent_Id: parent_id,
      Start_Date: startDate,
      End_Date: endDate,
    });

    await licence.save();

    if (Employee_permission) {
      const {
        Edit,
        trade_history,
        open_position,
        Licence_Edit,
        pertrade_edit,
        perlot_edit,
        limit_edit,
        Balance_edit,
      } = Employee_permission;

      const newPermission = new employee_permission({
        employee_id: newUser._id,
        Edit,
        trade_history,
        open_position,
        Licence_Edit,
        pertrade_edit,
        perlot_edit,
        limit_edit,
        Balance_edit,
      });

      await newPermission.save();
    }

    return res.json({
      status: true,
      message: "User added successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: "Failed to add user",
      data: [],
    });
  }
}

  async walletRecharge(req, res) {
    try {
      const { id, Balance, parent_Id, Type } = req.body;

      const dollarPriceData = await MarginRequired.findOne({
        adminid: parent_Id,
      }).select("dollarprice");
      if (!dollarPriceData) {
        return res.json({
          status: false,
          message: "Dollar price data not found",
          data: [],
        });
      }

      const dollarcount = (Balance / dollarPriceData.dollarprice).toFixed(3);

      const userdata = await User_model.findOne({ _id: id });
      if (!userdata) {
        return res.json({
          status: false,
          message: "User not found",
          data: [],
        });
      }

      let newBalance;
      if (Type === "CREDIT") {
        newBalance += amount;
      } else if (Type === "DEBIT") {
        newBalance -= amount;
        if (newBalance < 0) {
          return res.json({
            status: false,
            message: "Insufficient balance",
            data: [],
          });
        }
      } else {
        return res.json({
          status: false,
          message: "Invalid transaction type",
          data: [],
        });
      }

      await User_model.updateOne(
        { _id: userdata._id },
        { $set: { Balance: newBalance } }
      );

      const result = new Wallet_model({
        user_Id: userdata._id,
        Balance: dollarcount,
        parent_Id: parent_Id,
        Type: Type,
      });

      await result.save();

      let newstatement = new BalanceStatement({
        userid: userdata._id,
        Amount: dollarcount,
        parent_Id: parent_Id,
        type: "CREDIT",
        message: "Balance Credit",
      });
      await newstatement.save();

      return res.json({
        status: true,
        message: "Balance is updated",
        data: walletTransaction,
      });
    } catch (error) {
      console.error("Error in walletRecharge:", error);
      return res.json({
        status: false,
        message: "Internal error occurred",
        data: [],
      });
    }
  }

  async getAdminDetail(req, res) {
    try {
      const { id } = req.body;
      const result = await User_model.find({ parent_id: id }).sort({
        createdAt: -1,
      });

      const adminIds = result.map((user) => user._id);
      const permissions = await employee_permission.find({
        employee_id: { $in: adminIds },
      });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      const combinedData = result.map((user) => {
        const userPermissions = permissions.filter((permission) =>
          permission.employee_id.equals(user._id)
        );

        return {
          ...user.toObject(),
          permissions: userPermissions,
        };
      });

      return res.json({
        status: true,
        message: "Getting data",
        data: combinedData,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // update status
  async UpdateActiveStatusAdmin(req, res) {
    try {
      const { id, user_active_status } = req.body;
      const get_user = await User_model.find({ _id: id });
      if (get_user.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }

      const filter = { _id: id };
      const updateOperation = { $set: { ActiveStatus: user_active_status } };
      const result = await User_model.updateOne(filter, updateOperation);

      if (result) {
        // STATUS UPDATE SUCCESSFULLY
        var status_msg = user_active_status == "0" ? "DeActivate" : "Activate";

        res.send({
          status: true,
          msg: "Update Successfully",
          data: result,
        });
      }
    } catch (error) {
      console.log("Error trading status Error-", error);
    }
  }

  // admin history
  async getadminhistory(req, res) {
    try {
      const walletData = await Wallet_model.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_Id",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $project: {
            UserName: "$userData.UserName",
            Balance: 1,
            createdAt: 1,
            parent_Id: 1,
            Type: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      if (!walletData || walletData.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "Successfully fetched data",
        data: walletData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error", data: [] });
    }
  }

  async Update_Admin(req, res) {
    try {
      const data = req.body;
      const id = req.body.id;

      const filter = { _id: id, Role: "ADMIN" };
      const updateOperation = { $set: data };

      const result = await User_model.updateOne(filter, updateOperation);

      if (result.nModified === 0) {
        return res.json({
          status: false,
          message: "Data not Updated",
          data: [],
        });
      }
      return res.json({ status: true, message: "Data updated", data: result });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // deleted admin
  async Delete_Admin(req, res) {
    try {
      const { id } = req.body;
      const result = await User_model.findOneAndDelete({
        _id: id,
        Role: "ADMIN",
      });

      if (!result) {
        return res.json({
          success: false,
          message: "User not found",
          data: [],
        });
      }

      return res.json({
        success: true,
        message: "User deleted successfully",
        data: result,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  async SuperadminGetDashboardData(req, res) {
    try {
      const { parent_id } = req.body;
      const counts = await User_model.aggregate([
        {
          $facet: {
            TotalAdminCount: [
              { $match: { Role: "ADMIN", parent_id: parent_id } },
              { $count: "count" },
            ],
            TotalActiveAdminCount: [
              {
                $match: {
                  Role: "ADMIN",
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
            TotalAdminCount: {
              $ifNull: [{ $arrayElemAt: ["$TotalAdminCount.count", 0] }, 0],
            },
            TotalActiveAdminCount: {
              $ifNull: [
                { $arrayElemAt: ["$TotalActiveAdminCount.count", 0] },
                0,
              ],
            },
          },
        },
      ]);

      const { TotalAdminCount, TotalActiveAdminCount } = counts[0];

      var Count = {
        TotalAdminCount: TotalAdminCount,
        TotalActiveAdminCount: TotalActiveAdminCount,
        TotalInActiveAdminCount: TotalAdminCount - TotalActiveAdminCount,
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

  async getAllclent(req, res) {
    try {
      const { userid } = req.body;
      const result = await User_model.findOne({ _id: userid });

      if (!result) {
        return res.json({ status: false, message: "not found", data: [] });
      }

      return res.json({ status: true, message: "user found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  //get admin user detail
  async getadminuserdetail(req, res) {
    try {
      const { userid } = req.body;
      const result = await User_model.find({ parent_id: userid });

      if (!result) {
        return res.json({ status: false, message: "not found", data: [] });
      }

      return res.json({ status: true, message: "user found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  // get employee user
  async getEmployeeuserdetail(req, res) {
    try {
      const { userid } = req.body;
      const result = await User_model.find({ employee_id: userid });

      if (!result) {
        return res.json({ status: false, message: "not found", data: [] });
      }

      return res.json({ status: true, message: "user found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  // get licence detail
  async getlicencedetail(req, res) {
    try {
      const { userid } = req.body;
      const licenses = await totalLicense
        .find({ parent_Id: userid })
        .sort({ createdAt: -1 });
      const userIds = licenses.map((license) => license.user_Id);
      const users = await User_model.find({ _id: { $in: userIds } });

      const userMap = users.reduce((map, user) => {
        map[user._id] = user.UserName;
        return map;
      }, {});

      const resultWithUsernames = licenses.map((license) => ({
        ...license.toObject(),
        username: userMap[license.user_Id] || null,
      }));

      return res.json({
        status: true,
        message: "data find ",
        data: resultWithUsernames,
      });
    } catch (error) {
      return res.json({
        staus: false,
        message: "Error fetching license details",
        data: [],
      });
    }
  }

  // get all available position
  async getPosition_detail(req, res) {
    try {
      let result = await mainorder_model
        .find({
          $expr: { $ne: ["$buy_lot", "$sell_lot"] },
        })
        .sort({ createdAt: -1 });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({ status: true, message: "Data found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // get all brokerage data
  async brokerageDataForSuperAdmin(req, res) {
    try {
      const aggregatedData = await User_model.aggregate([
        {
          $match: {
            Role: "USER", // Fetch all users with Role as "USER"
          },
        },
        {
          $lookup: {
            from: "balancestatements",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $toObjectId: "$userid" }, "$$userId"] },
                      { $ne: ["$symbol", null] }, // Exclude documents where symbol is null
                    ],
                  },
                },
              },
            ],
            as: "balance_data",
          },
        },
        {
          $unwind: "$balance_data",
        },
        {
          $project: {
            _id: 0,
            user_id: 1,
            UserName: 1,
            balance_data: 1,
          },
        },
      ]);

      // Format the `brokerage` value to 5 decimal places
      const formattedData = aggregatedData.map((item) => {
        if (item.balance_data?.brokerage) {
          item.balance_data.brokerage = Number(
            item.balance_data.brokerage
          ).toFixed(5);
        }
        return item;
      });

      if (!formattedData || formattedData.length === 0) {
        return res.json({
          status: true,
          message: "No data found",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Data fetched successfully",
        data: formattedData,
      });
    } catch (error) {
      console.error("Error at brokerageDataForSuperAdmin", error);
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  async AddProfitMargin(req, res) {
    try {
      const { adminid, balance } = req.body;

      if (!adminid || !balance) {
        return res.json({
          status: false,
          message: "Missing required fields",
          data: [],
        });
      }

      const AdminData = await User_model.findOne({ _id: adminid });
      if (!AdminData) {
        return res.json({
          status: false,
          message: "Admin not found",
          data: [],
        });
      }

      // Update Usermodal ProfitBalance field

      let UpdateBalance =
        parseFloat(AdminData.ProfitBalance ? AdminData.ProfitBalance : 0) +
        parseFloat(balance ? balance : 0);

      await User_model.updateOne(
        { _id: adminid },
        { $set: { ProfitBalance: UpdateBalance } }
      );

      const profitmargin = new ProfitmarginData({
        adminid,
        balance,
      });
      await profitmargin.save();
      return res.json({
        status: true,
        message: "Profit Margin Added Successfully",
        data: profitmargin,
      });
    } catch (error) {
      console.error("Error at AddProfitMargin", error);
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  async getProfitMargin(req, res) {
    try {
      const { admin_id } = req.body;
      console.log("adminid", admin_id)

      if (!admin_id) {
        return res.json({
          status: false,
          message: "Missing required fields",
          data: [],
        });
      }

      const profitMarginData = await ProfitmarginData.find({ adminid: admin_id });
      if (!profitMarginData || profitMarginData.length === 0) {
        return res.json({
          status: false,
          message: "Profit margin data not found",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Profit margin data found",
        data: profitMarginData,
      });
    }
    catch (error) {
      console.error("Error at getProfitMargin", error);
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

}

module.exports = new Superadmin();
