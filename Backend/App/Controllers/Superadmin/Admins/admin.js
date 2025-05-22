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
const Company = require("../../../Models/Company.model");
const BonusCollectioniModel = require("../../../Models/BonusCollectioni.model");
const { sendPushNotification } = require("../../common/firebase");
const open_position = db.open_position;
class Superadmin {
  async AddAdmin(req, res) {
    try {
      let {
        FullName,
        UserName,
        Email,
        PhoneNo,
        parent_id,
        parent_role,
        password,
        Otp,
        Role,
        pertrade,
        perlot,
        turn_over_percentage,
        brokerage,
        limit,
        Employee_permission,
        ProfitMargin,
        FixedPerClient,
        FundAdd,
        EveryTransaction,
        FixedTransactionPercent,
        AddClientBonus,
        FundLessThan100,
        FundLessThan500,
        FundLessThan1000,
        FundGreaterThan1000,
        NetTransactionPercent,
        NetTransaction,
      } = req.body;

      UserName = UserName.toString().toLowerCase();
      Email = Email.toString().toLowerCase();

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

      const referralCode = crypto.randomBytes(3).toString("hex").toUpperCase();

      // Current date as start date
      const startDate = new Date();
      let endDate = new Date(startDate);
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

        password: hashedPassword,
        Start_Date: startDate,
        End_Date: endDate,
        ActiveStatus: activeStatus,
        ProfitMargin: ProfitMargin,
        ReferralCode: referralCode, // Add referral code to the user

        FixedPerClient,
        FundAdd,
        EveryTransaction,
        FixedTransactionPercent,
        AddClientBonus,
        FundLessThan100,
        FundLessThan500,
        FundLessThan1000,
        FundGreaterThan1000,
        NetTransactionPercent,
        NetTransaction,
      });

      await newUser.save();

      if (Employee_permission) {
        const {
          Edit,
          client_add,
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
          client_add,
        });

        await newPermission.save();
      }

      return res.json({
        status: true,
        message: "User added successfully",
        data: newUser,
      });
    } catch (error) {
      console.error("Error at AddAdmin", error);
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

      if (!Balance) {
        return res.json({
          status: false,
          message: "Please Enter Balance",
          data: [],
        });
      }

      // Parse Balance to a float
      const dollarcount = parseFloat(Balance);

      // Fetch user data
      const userdata = await User_model.findOne({ _id: id });
      if (!userdata) {
        return res.json({
          status: false,
          message: "User not found",
          data: [],
        });
      }

      // Initialize newBalance with the current balance
      let newBalance = parseFloat(userdata.Balance || 0);
      const parentUser = await User_model.findOne({ _id: parent_Id });

      // Update balance based on the transaction type
      if (Type === "CREDIT") {
        if (newBalance === 0) {
          if (parentUser && userdata.ReferredBy) {
            const ReferredByUser = await User_model.findOne({
              _id: userdata.ReferredBy,
            });
            if (ReferredByUser && ReferredByUser.Role === "USER") {
              let refferalAmount = 0;
              if (dollarcount > 50 && dollarcount <= 100) {
                refferalAmount = (dollarcount * parentUser.Range1) / 100;
              } else if (dollarcount > 100 && dollarcount <= 500) {
                refferalAmount = (dollarcount * parentUser.Range2) / 100;
              } else if (dollarcount > 500 && dollarcount <= 1000) {
                refferalAmount = (dollarcount * parentUser.Range3) / 100;
              } else if (dollarcount > 1000) {
                refferalAmount = (dollarcount * parentUser.Range4) / 100;
              }

              const newStatement = new BalanceStatement({
                userid: userdata.ReferredBy,
                Amount: refferalAmount,
                parent_Id: parentUser._id,
                type: "CREDIT",
                message: "Referral Balance Added",
              });
              await newStatement.save();
            }
          }
          if (
            parentUser.FixedPerClient &&
            dollarcount >= parentUser.AddClientBonus
          ) {
            const newBonus = new BonusCollectioniModel({
              admin_id: parentUser._id,
              user_id: userdata._id,
              Bonus: parentUser.AddClientBonus,
              Type: "Fixed_PerClient",
            });
            await newBonus.save();
          }
          if (newBalance === 0) {
            if (parentUser && parentUser.FundAdd) {
              let calculatedBonus;

              if (dollarcount < 100) {
                calculatedBonus = parentUser.FundLessThan100;
              } else if (dollarcount < 500) {
                calculatedBonus = parentUser.FundLessThan500;
              } else if (dollarcount < 1000) {
                calculatedBonus = parentUser.FundLessThan1000;
              } else {
                calculatedBonus = parentUser.FundGreaterThan1000;
              }
              const newBonus = new BonusCollectioniModel({
                admin_id: parentUser._id,
                user_id: userdata._id,
                Bonus: calculatedBonus,
                Type: "Fund_Add",
              });

              await newBonus.save();
            }
          }
        } else if (newBalance >= 0) {
          if (parentUser && newBalance > 0 && parentUser.EveryTransaction) {
            let BonusForFixedTransaction =
              dollarcount * (parentUser.FixedTransactionPercent / 100);

            const newBonus = new BonusCollectioniModel({
              admin_id: parentUser._id,
              user_id: userdata._id,
              Bonus: BonusForFixedTransaction,
              Type: "Every_Transaction",
            });
            await newBonus.save();
          }
        }
        newBalance += dollarcount;

        sendPushNotification(
          userdata.DeviceToken,
          "Wallet Recharge",
          `Your wallet has been credited with ${dollarcount} USD`
        );
      } else if (Type === "DEBIT") {
        newBalance -= dollarcount;
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

      // Update user's balance in the database
      await User_model.updateOne(
        { _id: userdata._id },
        { $set: { Balance: newBalance } }
      );

      // Save the wallet transaction
      const result = new Wallet_model({
        user_Id: userdata._id,
        Balance: dollarcount,
        parent_Id: parent_Id,
        Type: Type,
      });
      await result.save();

      // Save the balance statement
      const newStatement = new BalanceStatement({
        userid: userdata._id,
        Amount: dollarcount,
        parent_Id: parent_Id,
        type: Type,
        message: Type === "CREDIT" ? "Balance Credit" : "Balance Debit",
      });
      await newStatement.save();

      return res.json({
        status: true,
        message: "Balance is updated",
        data: { newBalance },
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal error occurred",
        data: [],
      });
    }
  }

  async getAdminDetail(req, res) {
    try {
      const { id, page = 1, limit = 10 } = req.body; // You can also take page/limit from req.query
      const skip = (page - 1) * limit;

      // Step 1: Get paginated users
      const result = await User_model.find({ parent_id: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      // Step 2: Get total count for pagination info
      const totalCount = await User_model.countDocuments({ parent_id: id });

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
        pagination: {
          total: totalCount,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalCount / limit),
        },
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
          message: "Empty data",
          data: [],
        });
      }

      const filter = { _id: id };
      const updateOperation = { $set: { ActiveStatus: user_active_status } };
      const result = await User_model.updateOne(filter, updateOperation);

      if (result) {
        // STATUS UPDATE SUCCESSFULLY
        var status_msg = user_active_status == "0" ? "DeActivate" : "Activate";

        sendPushNotification(
          get_user[0].DeviceToken,
          "Account Status",
          `Your account has been ${status_msg}`
        );

        res.send({
          status: true,
          message: "Update Successfully",
          data: result,
        });
      }
    } catch (error) {}
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

  async getPosition_detail(req, res) {
    try {
      const { adminid } = req.body;

      let result = await mainorder_model
        .find({
          adminid: adminid,
          $expr: { $ne: ["$buy_lot", "$sell_lot"] },
        })
        .sort({ createdAt: -1 });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      const adminIds = result.map((item) => item.adminid);
      const userIds = result.map((item) => item.userid);

      const adminUsers = await User_model.find({ _id: { $in: adminIds } });
      const users = await User_model.find({ _id: { $in: userIds } });

      // Create a mapping of adminid to username
      const adminUsernameMap = adminUsers.reduce((acc, user) => {
        acc[user._id] = user.UserName; // Assuming 'UserName' is the key for usernames
        return acc;
      }, {});

      // Create a mapping of userid to username
      const userUsernameMap = users.reduce((acc, user) => {
        acc[user._id] = user.UserName; // Assuming 'UserName' is the key for usernames
        return acc;
      }, {});

      // Add the adminName and userName to each result based on adminid and userid
      result = result.map((item) => {
        return {
          ...item.toObject(),
          adminName: adminUsernameMap[item.adminid] || "Unknown", // Default to "Unknown" if not found
          userName: userUsernameMap[item.userid] || "Unknown", // Default to "Unknown" if not found
        };
      });
      result = result.filter(
        (item) => item.adminName !== "Unknown" && item.userName !== "Unknown"
      );

      return res.json({ status: true, message: "Data found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  //  --------------
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

      if (!admin_id) {
        return res.json({
          status: false,
          message: "Missing required fields",
          data: [],
        });
      }

      const profitMarginData = await ProfitmarginData.find({
        adminid: admin_id,
      }).sort({ createdAt: -1 });
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
    } catch (error) {
      console.error("Error at getProfitMargin", error);
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  // ___________CompanyModel Controller________
  async createOrUpdateCompany(req, res) {
    try {
      const { panelName, logo, favicon, loginImage, loginUrl } = req.body;

      if (!panelName || !logo || !favicon || !loginImage) {
        return res.json({
          status: false,
          message: "Missing required fields",
          data: [],
        });
      }

      let company = await Company.updateOne(
        {},
        {
          $set: {
            panelName,
            logo,
            favicon,
            loginImage,
            loginUrl,
          },
        },
        { upsert: true }
      );

      if (!company) {
        return res.json({
          status: false,
          message: "Failed to create or update company settings",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Company settings updated",
        data: company,
      });
    } catch (error) {
      console.error("Error at createOrUpdateCompany", error);
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  // READ: Get company settings
  async getCompany(req, res) {
    try {
      const company = await Company.findOne();
      const token = req.cookies.token;
      if (!token) {
        return res.json({ message: "No token provided",status: false,data: [] });
      }

      if (!company) {
        return res.json({
          status: false,
          message: "Company settings not found",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Company settings found",
        data: company,
      });
    } catch (error) {
      console.error("Error at getCompany", error);
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  // DELETE: Delete company settings
  async deleteCompany(req, res) {
    try {
      const { companyId } = req.body;

      if (!companyId) {
        return res.json({
          status: false,
          message: "Missing companyId field",
          data: [],
        });
      }

      const company = await Company.findById(companyId);

      if (!company) {
        return res.json({
          status: false,
          message: "Company settings not found",
          data: [],
        });
      }
      await company.remove();

      return res.json({
        status: true,
        message: "Company settings deleted successfully",
        data: [],
      });
    } catch (error) {
      console.error("Error at deleteCompany", error);
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  async getAdminName(req, res) {
    try {
      const result = await User_model.find({
        Role: "ADMIN",
      })
        .select(
          "FullName UserName _id ProfitMargin FixedPerClient FundAdd EveryTransaction NetTransactionPercent"
        )
        .sort({ createdAt: -1 });

      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      // Add computed keys
      const updatedResult = result.map((user) => {
        const {
          ProfitMargin,
          FixedPerClient,
          FundAdd,
          EveryTransaction,
          NetTransactionPercent,
        } = user;

        const brokerage = ProfitMargin && ProfitMargin !== 0 ? true : false;

        const bonus =
          !!FixedPerClient ||
          !!FundAdd ||
          !!EveryTransaction ||
          !!NetTransactionPercent;

        return {
          // ...user._doc, // include existing fields
          brokerage,
          bonus,
          UserName: user.UserName,
          _id: user._id,
        };
      });

      return res.json({
        status: true,
        message: "User found",
        data: updatedResult,
      });
    } catch (error) {
      console.error("Error in getAdminName:", error);
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  async gettradehistory(req, res) {
    try {
      const { adminid, fromDate, toDate } = req.body;

      // Build query filter object
      const query = { adminid };

      // Add date filter if fromDate or toDate exists
      if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) {
          query.createdAt.$gte = new Date(fromDate); // greater or equal fromDate
        }
        if (toDate) {
          // To include the entire toDate day, set time to end of day
          const toDateObj = new Date(toDate);
          toDateObj.setHours(23, 59, 59, 999);
          query.createdAt.$lte = toDateObj; // less or equal to toDate
        }
      }

      const result = await mainorder_model.find(query).sort({ createdAt: -1 });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "user not found", data: [] });
      }

      const userIds = result.map((item) => item.userid);

      const users = await User_model.find({ _id: { $in: userIds } });

      const userNameMap = users.reduce((acc, user) => {
        acc[user._id] = user.UserName;
        return acc;
      }, {});

      const mappedResult = result.map((item) => ({
        ...item.toObject(),
        userName: userNameMap[item.userid] || "Unknown",
      }));

      return res.json({
        status: true,
        message: "user found",
        data: mappedResult,
      });
    } catch (error) {
      console.error(error);
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  async GetAdminBalanceWithPosition(req, res) {
    try {
      const { admin_id } = req.body;

      if (!admin_id) {
        return res.json({
          status: false,
          message: "Admin ID is required",
          data: [],
        });
      }

      // MongoDB Aggregation for sum and count
      const result = await User_model.aggregate([
        { $match: { parent_id: admin_id } },
        {
          $group: {
            _id: null,
            totalBalance: { $sum: "$Balance" },
            userCount: { $sum: 1 },
          },
        },
      ]);

      const openPositions = await open_position
        .find({ adminid: admin_id })
        .toArray();

      let totalPnL = 0;

      const positionsWithPnL = openPositions.map((pos) => {
        let pnl = 0;

        if (
          pos.signal_type === "buy_sell" &&
          pos.buy_price &&
          pos.buy_qty &&
          pos.live_price
        ) {
          pnl = (pos.live_price - pos.buy_price) * pos.buy_qty;
        } else if (
          pos.signal_type === "sell_buy" &&
          pos.sell_price &&
          pos.sell_qty &&
          pos.live_price
        ) {
          pnl = (pos.sell_price - pos.live_price) * pos.sell_qty;
        }

        totalPnL += pnl;

        return {
          ...pos,
          pnl: pnl, // round to 2 decimals
        };
      });

      totalPnL = totalPnL; // round total pnl

      const response = result[0] || {
        totalBalance: 0,
        userCount: 0,
        data: positionsWithPnL,
      };

      return res.json({
        status: true,
        message: "Balance and count fetched successfully",
        data: { ...response, data: positionsWithPnL, totalPnL: totalPnL },
      });
    } catch (error) {
      console.error("Error in GetAdminBalanceWithPosition:", error);
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = new Superadmin();
