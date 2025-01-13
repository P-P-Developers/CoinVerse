"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const { sendPushNotification } = require("../../common/firebase");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const totalLicense = db.totalLicense;
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const MarginRequired = db.MarginRequired;
const Symbol = db.Symbol;
const BalanceStatement = db.BalanceStatement;
const mainorder_model = db.mainorder_model;
const employee_permission = db.employee_permission;

// const nodemailer = require('nodemailer');

class Admin {
  async AddUser(req, res) {
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
        Balance,
        Licence,
        pertrade,
        perlot,
        turn_over_percentage,
        brokerage,
        limit,
        employee_id,
      } = req.body;

      if (!FullName || !UserName || !Email || !PhoneNo || !password || !Role) {
        return res.json({ status: false, message: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await User_model.findOne({
        $or: [{ UserName }, { Email }, { PhoneNo }],
      });

      if (existingUser) {
        const duplicateField =
          existingUser.UserName === UserName
            ? "Username"
            : existingUser.Email === Email
              ? "Email"
              : "Phone Number";

        return res.json({
          status: false,
          message: `${duplicateField} already exists`,
          data: [],
        });
      }

      // Set end date based on license duration
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + Number(Licence));

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.toString(), salt);

      let brokeragepertrade = pertrade ? parseFloat(pertrade) : 0;
      let brokerageperlot = perlot ? parseFloat(perlot) : 0;

      // Handle NaN cases explicitly
      brokeragepertrade = isNaN(brokeragepertrade) ? null : brokeragepertrade;
      brokerageperlot = isNaN(brokerageperlot) ? null : brokerageperlot;

      // Set ActiveStatus based on parent_role
      const activeStatus = parent_role === "EMPLOYE" ? 0 : 1;

      // Create new user
      const newUser = new User_model({
        FullName,
        UserName,
        Email,
        PhoneNo,
        employee_id,
        parent_id,
        parent_role,
        Balance: Balance,
        Otp: password,
        Role,
        Licence,
        pertrade: brokeragepertrade || "",
        perlot: brokerageperlot || "",
        turn_over_percentage,
        brokerage,
        limit,
        password: hashedPassword,
        Start_Date: startDate,
        End_Date: endDate,
        ActiveStatus: activeStatus,
      });

      await newUser.save();

      // Create wallet and balance statement
      const userWallet = new Wallet_model({
        user_Id: newUser._id,
        Balance: Balance,
        parent_Id: parent_id,
        Type: "CREDIT",
      });
      await userWallet.save();

      const newStatement = new BalanceStatement({
        userid: newUser._id,
        Amount: Balance,
        parent_Id: parent_id,
        type: "CREDIT",
        message: "Balance Added",
      });
      await newStatement.save();

      // Create license record
      const licenceRecord = new totalLicense({
        user_Id: newUser._id,
        Licence,
        parent_Id: parent_id,
        Start_Date: startDate,
        End_Date: endDate,
      });
      await licenceRecord.save();

      return res.json({
        status: true,
        message: "User added successfully",
        data: newUser,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      return res.json({
        status: false,
        message: "Failed to add User",
        data: [],
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id, perlot, pertrade, ...rest } = req.body;

      const userdetail = await User_model.findOne({ _id: id });

      // Convert perlot and pertrade using the dollar price
      let brokeragepertrade = pertrade;
      let brokerageperlot = perlot;

      // Handle NaN cases
      brokeragepertrade = isNaN(brokeragepertrade) ? null : brokeragepertrade;
      brokerageperlot = isNaN(brokerageperlot) ? null : brokerageperlot;

      const values = [brokerageperlot, brokeragepertrade];
      const nonZeroValues = values.filter(
        (value) => value !== null && value !== 0
      );

      if (nonZeroValues.length > 1) {
        return res.send({
          status: false,
          message: "Only one of perlot or pertrade can have a non-zero value",
        });
      }

      // Initialize dataToUpdate with default zero values
      let dataToUpdate = {
        perlot: 0,
        pertrade: 0,
        ...rest,
      };

      // Assign non-zero converted values accordingly
      if (brokerageperlot !== null && brokerageperlot !== 0) {
        dataToUpdate.perlot = brokerageperlot;
      } else if (brokeragepertrade !== null && brokeragepertrade !== 0) {
        dataToUpdate.pertrade = brokeragepertrade;
      }

      const filter = { _id: id };
      const updateOperation = { $set: dataToUpdate };

      const updatedUser = await User_model.findOneAndUpdate(
        filter,
        updateOperation,
        {
          new: true,
          upsert: true,
        }
      );

      if (!updatedUser) {
        return res.send({
          status: false,
          message: "Data not updated",
          data: [],
        });
      }

      return res.send({
        status: true,
        message: "Data updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Internal error:", error);
      return res.send({
        status: false,
        message: "Internal server error",
      });
    }
  }

  async updateLicence(req, res) {
    try {
      const { id, Licence, parent_Id } = req.body;

      // Find the user by ID
      const userdata = await User_model.findOne({ _id: id });
      if (!userdata) {
        return res.json({
          status: false,
          message: "User not found",
          data: [],
        });
      }

      // Current date as start date
      const currentDate = new Date();
      const startDate = new Date(
        userdata.End_Date >= currentDate ? userdata.End_Date : currentDate
      );

      // Calculate the new end date
      let newEndDate = new Date(startDate);
      newEndDate.setMonth(newEndDate.getMonth() + Number(Licence));

      if (newEndDate.getDate() < startDate.getDate()) {
        newEndDate.setDate(0);
      }

      const newLicence = Number(userdata.Licence || 0) + Number(Licence);

      await User_model.updateOne(
        { _id: userdata._id },
        { $set: { Licence: newLicence, End_Date: newEndDate } }
      );

      const result = new totalLicense({
        user_Id: userdata._id,
        Licence: Licence,
        parent_Id: parent_Id,
        Start_Date: startDate,
        End_Date: newEndDate,
      });
      await result.save();

      return res.json({
        status: true,
        message: "Licence is updated",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // user by id
  async DeleteUser(req, res) {
    try {
      const { id } = req.body;
      const result = await User_model.findOneAndDelete({ _id: id });

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "User not found", data: [] });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", data: [] });
    }
  }

  async Update_Employe(req, res) {
    try {
      const data = req.body;
      const id = req.body.id;
      const employeePermissionData = req.body.Employee_permission;

      const filter = { _id: id };
      const updateOperation = { $set: data };
      const result = await User_model.updateOne(filter, updateOperation);

      if (result.nModified === 0) {
        return res.json({
          status: false,
          message: "Data not updated",
          data: [],
        });
      }

      const permissionFilter = { employee_id: id };
      const permissionUpdateOperation = { $set: employeePermissionData };
      await employee_permission.updateOne(
        permissionFilter,
        permissionUpdateOperation,
        { upsert: true }
      );

      return res.json({ status: true, message: "Data updated", data: result });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // delete Employee User

  async Delete_Employee(req, res) {
    try {
      const { id } = req.body;
      const result = await User_model.findOneAndDelete({
        _id: id,
        Role: "EMPLOYE",
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

  // get paymentstatus

  async getuserpaymentstatus(req, res) {
    try {
      const { adminid } = req.body;

      const walletData = await PaymenetHistorySchema.aggregate([
        {
          $match: {
            adminid: adminid,
          },
        },
        {
          $addFields: {
            userid: { $toObjectId: "$userid" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userid",
            foreignField: "_id",
            as: "userName",
          },
        },
        {
          $unwind: "$userName",
        },
        {
          $project: {
            UserName: "$userName.UserName",
            FullName: "$userName.FullName",
            adminid: 1,
            type: 1,
            status: 1,
            createdAt: 1,
            _id: 1,
            userid: 1,
            Balance: 1,
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
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  async UpdateStatus(req, res) {
    try {
      const { admin_id, id, status } = req.body;
      

      // Validate and find the payment history
      const paymentHistoryFind = await PaymenetHistorySchema.findOne({
        _id: new ObjectId(id),
      });
      if (!paymentHistoryFind) {
        return res.json({
          status: false,
          message: "Payment history not found",
        });
      }

      // Find the user balance and DeviceToken
      const findUser = await User_model.findOne({
        _id: new ObjectId(paymentHistoryFind.userid),
      }).select("Balance DeviceToken");
      if (!findUser) {
        return res.json({ status: false, message: "User not found" });
      }

      // Handle Status = 1 (Accepted)
      if (status == 1) {
        if (paymentHistoryFind.type === 0) {
          // Withdrawal Request
          if (paymentHistoryFind.Balance > findUser.Balance) {
            return res.json({ status: false, message: "Insufficient balance" });
          }

          // Deduct balance
          findUser.Balance -= paymentHistoryFind.Balance;
          await findUser.save();

          // Update payment history
          paymentHistoryFind.status = status;
          await paymentHistoryFind.save();

          // Update wallet
          const walletUpdateResult = new Wallet_model({
            user_Id: findUser._id,
            Balance: paymentHistoryFind.Balance,
            parent_Id: admin_id,
            Type: "DEBIT",
          });





          const balanceStatement = new BalanceStatement({
            userid: findUser._id,
            Amount: -paymentHistoryFind.Balance,
            type: "DEBIT",
            message: "Balance used for withdrawal",
            parent_Id: admin_id,
            orderid: null,

          });
          await balanceStatement.save();
          await walletUpdateResult.save();

          const { DeviceToken } = findUser;
          if (DeviceToken) {
            await sendPushNotification(
              DeviceToken,
              "Withdrawal Accepted",
              "Your withdrawal request has been accepted successfully."
            );
          } else {
            console.warn("DeviceToken not found for user:", findUser._id);
          }

          return res.json({
            status: true,
            message: "Withdrawal request accepted successfully",
          });
        } else if (paymentHistoryFind.type === 1) {
          // Deposit Request
          // Add balance
          findUser.Balance += paymentHistoryFind.Balance;
          await findUser.save();

          // Update payment history
          paymentHistoryFind.status = status;
          await paymentHistoryFind.save();

          // Update wallet
          const walletUpdateResult = new Wallet_model({
            user_Id: findUser._id,
            Balance: paymentHistoryFind.Balance,
            parent_Id: admin_id,
            Type: "CREDIT",
          });
          await walletUpdateResult.save();

          const balanceStatement = new BalanceStatement({
            userid: findUser._id,
            Amount: -paymentHistoryFind.Balance,
            type: "CREDIT",
            message: "Balance used for Deposit",
            parent_Id: admin_id,
            orderid: null,
          });
          await balanceStatement.save();



          // Send push notification for Accepted Status
          const { DeviceToken } = findUser;
          if (DeviceToken) {
            await sendPushNotification(
              DeviceToken,
              "Deposit Accepted",
              "Your deposit request has been accepted successfully."
            );
          } else {
            console.warn("DeviceToken not found for user:", findUser._id);
          }

          return res.json({
            status: true,
            message: "Deposit request accepted successfully",
          });
        } else {
          return res.json({ status: false, message: "Invalid type provided" });
        }

        // Handle Status = 2 (Rejected)
      } else if (status == 2) {
        // Update the payment history to rejected
        paymentHistoryFind.status = status;
        await paymentHistoryFind.save();

        // Check if it's a withdrawal request (type === 0)
        if (paymentHistoryFind.type === 0) {
          // Withdrawal Request
          const { DeviceToken } = findUser;
          if (DeviceToken) {
            await sendPushNotification(
              DeviceToken,
              "Withdrawal Rejected",
              "Your withdrawal request has been rejected."
            );
          } else {
            console.warn("DeviceToken not found for user:", findUser._id);
          }
        } else if (paymentHistoryFind.type === 1) {
          // Deposit Request
          const { DeviceToken } = findUser;
          if (DeviceToken) {
            await sendPushNotification(
              DeviceToken,
              "Deposit Rejected",
              "Your deposit request has been rejected."
            );
          } else {
            console.warn("DeviceToken not found for user:", findUser._id);
          }
        }

        return res.json({
          status: true,
          message: "Request rejected successfully",
        });
      } else {
        return res.json({ status: false, message: "Invalid status provided" });
      }
    } catch (error) {
      console.error("Error in UpdateStatus:", error);
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // ----------------------- Working code ----------------------------

  async getsymbolholdoff(req, res) {
    try {
      const result = await Symbol.find({});
      if (!result) {
        return res.json({
          status: false,
          message: "symbol not found",
          data: [],
        });
      }
      return res.json({ status: true, message: "symbol  found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error ", data: [] });
    }
  }

  // ---------------- getBrockerage data api for brockerage page

  // 66adf2e5c1718a8affb23545 // admin_id

  async brokerageData(req, res) {
    try {
      const { admin_id } = req.body;

      if (!admin_id) {
        return res.json({
          status: false,
          message: "Admin ID is required",
          data: [],
        });
      }

      const aggregatedData = await User_model.aggregate([
        {
          $match: {
            Role: "USER",
            parent_id: admin_id,
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
                      { $ne: ["$symbol", null] },
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
      console.error("Error at brokerageData", error);
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  async updatesymbolholoff(req, res) {
    try {
      const { symbol, user_active_status } = req.body;

      if (!symbol) {
        return res.json({
          stats: false,
          message: "symbol ID is required.",
          data: [],
        });
      }

      const result = await Symbol.updateOne(
        { symbol: symbol },
        { status: user_active_status }
      );

      return res.json({
        status: true,
        message: "Updated",
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.json({ message: "An error occurred while updating margin." });
    }
  }

  // async getbalancandLicence(req,res){
  //     try {
  //       const {userid ,Role} = req.body
  //       const result = await User_model.findOne({_id:userid , Role:Role}).select("Balance Licence")

  //       const dolaarprice = await MarginRequired.findOne({adminid:userid})

  //       if(!result){
  //        return  res.json({status:false,message:"not found",data:[]})
  //       }

  //       return res.json({status:true,message:"found",data:result})

  //     } catch (error) {
  //       return  res.json({status:false , message:"iternal error", data:[]})
  //     }
  // }

  async getbalancandLicence(req, res) {
    try {
      const { userid, Role } = req.body;

      // Fetch user details
      const result = await User_model.findOne({ _id: userid, Role })
        .select("Balance Licence")
        .sort({ createdAt: -1 });
      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      // Fetch dollar price document
      const dollarPriceDoc = await MarginRequired.findOne({ adminid: userid });
      if (!dollarPriceDoc || !dollarPriceDoc.dollarprice) {
        return res.json({
          status: false,
          message: "Dollar price not found",
          data: [],
        });
      }

      // Calculate balance in rupees using the dollar price
      const conversionRate = dollarPriceDoc.dollarprice;
      const balanceInRupees = result.Balance * conversionRate;

      // Return response
      return res.json({
        status: true,
        message: "Data found",
        data: {
          ...result.toObject(),
          BalanceInRupees: balanceInRupees,
        },
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // count toatal baance

  async countuserBalance(req, res) {
    try {
      const { userid } = req.body;

      if (!userid) {
        return res.json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }

      const checkuser = await Wallet_model.find({ parent_Id: userid }).select(
        "Balance Type"
      );

      const totalBalance = checkuser.reduce((sum, user) => {
        if (user.Type === "CREDIT") {
          return sum + Number(user.Balance);
        } else if (user.Type === "DEBIT") {
          return sum - Number(user.Balance);
        } else {
          return sum;
        }
      }, 0);

      const findadmin = await User_model.findOne({ _id: userid }).select(
        "Balance"
      );

      if (!findadmin) {
        return res.json({
          status: false,
          message: "Admin not found",
          data: [],
        });
      }

      const counttotalbalance =
        Number(findadmin.Balance) - Number(totalBalance);

      const dollarPriceDoc = await MarginRequired.findOne({ adminid: userid });

      if (!dollarPriceDoc || !dollarPriceDoc.dollarprice) {
        return res.json({
          status: false,
          message: "Dollar price not found",
          data: [],
        });
      }

      const conversionRate = dollarPriceDoc.dollarprice;
      const balanceInRupees = counttotalbalance * conversionRate;

      return res.json({
        status: true,
        message: "Success",
        Balance: balanceInRupees,
        dollarPriceDoc,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  // totalcount Licence
  async TotalcountLicence(req, res) {
    try {
      const { userid } = req.body;

      if (!userid) {
        return res.json({
          status: false,
          message: "User ID is required",
          data: [],
        });
      }

      const licenses = await totalLicense
        .find({ parent_Id: userid })
        .select("Licence");

      const totalLicenses = licenses.reduce(
        (acc, curr) => acc + curr.Licence,
        0
      );

      const user = await User_model.findOne({ _id: userid });

      if (!user) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      const licenseDiff = Number(user.Licence) - Number(totalLicenses);

      return res.json({
        status: true,
        message: "Success",
        data: {
          totalLicenses: totalLicenses,
          CountLicence: licenseDiff,
          userLicence: user.Licence,
        },
      });
    } catch (error) {
      console.error(error);
      return res.json({
        status: false,
        message: "Internal Server Error",
        data: [],
      });
    }
  }

  async getclienttradehistory(req, res) {
    try {
      const { userid, adminid } = req.body;
      let result;

      if (!userid || userid === "all") {
        result = await mainorder_model
          .find({ adminid })
          .sort({ createdAt: -1 });
      } else {
        result = await mainorder_model
          .find({ userid: userid })
          .sort({ createdAt: -1 });
      }

      if (!result) {
        return res.json({ status: false, message: "user not found", data: [] });
      }

      return res.json({ status: true, message: "user found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  //  async getlicensedata(req,res){
  //     try {
  //        const {userid} = req.body
  //        const result = await User_model.find({parent_id:userid})

  //        if(!result){
  //         return res.json({ status: false, message: "User not found" , data:[]});
  //        }
  //        return res.json({ status: true, message: "User found" , data:result});

  //     } catch (error) {
  //       return res.json({ status: false, message: "internal error" , data:[]})
  //     }
  //  }

  async getlicensedata(req, res) {
    try {
      const { userid } = req.body;
      const result = await User_model.find({ parent_id: userid })
        .select("UserName Start_Date End_Date")
        .sort({ createdAt: -1 });

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      const currentDate = new Date();
      const allData = result;
      const liveData = result.filter((record) => {
        const startDate = new Date(record.Start_Date);
        const endDate = new Date(record.End_Date);
        return startDate <= currentDate && currentDate <= endDate;
      });
      const expiredData = result.filter((record) => {
        const endDate = new Date(record.End_Date);
        return currentDate > endDate;
      });

      return res.json({
        status: true,
        message: "User found",
        data: { allData, liveData, expiredData },
      });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  async employee_permission(req, res) {
    try {
      const {
        employee_id,
        Edit,
        trade_history,
        open_position,
        Licence_Edit,
        pertrade_edit,
        perlot_edit,
        limit_edit,
      } = req.body;

      const employee = await employee_permission.findById(employee_id);

      if (!employee) {
        return res.json({
          status: false,
          message: "Employee not found",
          data: [],
        });
      }

      employee.Edit = Edit;
      employee.trade_history = trade_history;
      employee.open_position = open_position;
      employee.Licence_Edit = Licence_Edit;
      employee.pertrade_edit = pertrade_edit;
      employee.perlot_edit = perlot_edit;
      employee.limit_edit = limit_edit;

      await employee.save();

      return res.status.json({
        status: true,
        message: "Employee permissions updated successfully",
      });
    } catch (error) {
      return res.status.json({
        status: false,
        message: "Server error",
        data: [],
      });
    }
  }

  async getUsersName(req, res) {
    try {
      const { admin_id } = req.body;
      const result = await User_model.find({
        Role: "USER",
        parent_id: admin_id,
      }).select("FullName UserName");
      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }
      return res.json({ status: true, message: "User found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }
}

module.exports = new Admin();
