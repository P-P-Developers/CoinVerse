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
const ResearchModel = db.ResearchModel;
const UpiDetails = db.UpiDetails;
const Useraccount = db.Useraccount;

// const nodemailer = require('nodemailer');
const Conversation = db.Conversation;
const Message = db.Message;
const Sign_In = db.Sign_In;
const crypto = require("crypto");
const path = require("path");
const BonusCollectioniModel = require("../../../Models/BonusCollectioni.model");

const Company = db.Company;

const apkPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "Uploads",
  "application.apk"
);

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
        pertrade,
        perlot,
        transactionwise,
        turn_over_percentage,
        brokerage,
        limit,
        employee_id,
        referred_by,
        referral_price,
        singleUserId,
      } = req.body;

      if (!FullName || !UserName || !Email || !PhoneNo || !password || !Role) {
        return res.json({ status: false, message: "Missing required fields" });
      }
      let Licence = 10;

      const parentUser = await User_model.findOne({ _id: parent_id });

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

      const referralCode = crypto.randomBytes(3).toString("hex").toUpperCase();

      // Check if the referral code already exists
      const existingReferralCode = await User_model.findOne({
        ReferralCode: referralCode,
      });

      if (existingReferralCode) {
        // If it exists, generate a new one
        referralCode = crypto.randomBytes(3).toString("hex").toUpperCase();
      }

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
        pertrade: brokeragepertrade || "",
        perlot: brokerageperlot || "",
        transactionwise: transactionwise || "",
        turn_over_percentage,
        brokerage,
        limit,
        password: hashedPassword,
        Start_Date: startDate,
        End_Date: endDate,
        ActiveStatus: activeStatus,
        ReferralCode: referralCode,
        ReferredBy: referred_by,
      });

      await newUser.save();

      if (referred_by) {
        // Activate referred user
        await Sign_In.updateOne(
          { _id: singleUserId },
          { $set: { isActive: true } }
        );

        // Get referring user
        const referringUser = await User_model.findById(referred_by);

        const creditAmount = referral_price || 0;
        const updatedBalance = (referringUser?.Balance || 0) + creditAmount;

        // Update balance
        await User_model.updateOne(
          { _id: referred_by },
          { $set: { Balance: updatedBalance } }
        );

        // Log in wallet
        const walletEntry = new Wallet_model({
          user_Id: referred_by, // or just `referred_by`
          Balance: creditAmount,
          parent_Id: referringUser.parent_id || null,
          Type: "CREDIT",
        });

        await walletEntry.save();

        if (Balance > 0) {
          const newStatement = new BalanceStatement({
            userid: referred_by,
            Amount: creditAmount,
            parent_Id: referringUser.parent_id,
            type: "CREDIT",
            message: "Referral Balance Added",
          });
          await newStatement.save();

          await Sign_In.updateOne(
            { _id: singleUserId },
            { $set: { isPaymentDone: true } }
          );
        }
      }

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

      if (parentUser.Role === "ADMIN" && parentUser.FixedPerClient) {
        if (parentUser && Balance >= parentUser.AddClientBonus) {
          const newBonus = new BonusCollectioniModel({
            admin_id: parentUser._id,
            user_id: newUser._id,
            Bonus: parentUser.AddClientBonus,
            Type: "Fixed_PerClient",
          });
          await newBonus.save();
        }

        if (parentUser && parentUser.FundAdd && Balance > 0) {
          let calculatedBonus;

          if (Balance > 0 && Balance < 100) {
            calculatedBonus = parentUser.FundLessThan100;
          } else if (Balance < 500) {
            calculatedBonus = parentUser.FundLessThan500;
          } else if (Balance < 1000) {
            calculatedBonus = parentUser.FundLessThan1000;
          } else {
            calculatedBonus = parentUser.FundGreaterThan1000;
          }
          const newBonus = new BonusCollectioniModel({
            admin_id: parentUser._id,
            user_id: newUser._id,
            Bonus: calculatedBonus,
            Type: "Fund_Add",
          });

          await newBonus.save();
        }
      }

      return res.json({
        status: true,
        message: "User added successfully",
        data: newUser,
      });
    } catch (error) {
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
      // const result = await User_model.findOneAndDelete({ _id: id });

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

  async getuserpaymentstatus(req, res) {
    try {
      const { adminid, type, activeTab, page = 1, limit = 10 } = req.body;

      // Validation
      if (!adminid || type === "" || !activeTab) {
        return res.json({
          status: false,
          message: "adminid, type, and activeTab are required",
          data: [],
        });
      }

      const statusMap = {
        Complete: 1,
        Reject: 2,
        Pending: 0,
      };

      const status = statusMap[activeTab] ?? 0;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Count total records
      const totalRecords = await PaymenetHistorySchema.countDocuments({
        adminid,
        type,
        status,
      });

      const walletData = await PaymenetHistorySchema.aggregate([
        {
          $match: {
            adminid,
            type,
            status,
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
            as: "UserName",
          },
        },
        {
          $unwind: {
            path: "$UserName",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 👇 Combine two lookups: one for isPrimary true, another fallback to any
        {
          $lookup: {
            from: "useraccounts",
            let: { userIdRef: "$userid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$userId", "$$userIdRef"],
                  },
                },
              },
              {
                $sort: {
                  isPrimary: -1, // ✅ Sort so primary appears first, fallback second
                  createdAt: 1, // ✅ If both have same isPrimary (false), pick oldest
                },
              },
              { $limit: 1 }, // ✅ Take only one: either primary or first available
            ],
            as: "primaryAccount",
          },
        },
        {
          $unwind: {
            path: "$primaryAccount",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            UserName: "$UserName.UserName",
            FullName: "$UserName.FullName",
            UserBalance: "$UserName.Balance",
            adminid: 1,
            type: 1,
            status: 1,
            createdAt: 1,
            _id: 1,
            userid: 1,
            Balance: 1,
            ScreenShot: 1,
            transactionId: 1,

            // ✅ Return account details from either primary or fallback account
            upiId: "$primaryAccount.upiId",
            accountHolderName: "$primaryAccount.accountHolderName",
            bankName: "$primaryAccount.bankName",
            bankAccountNo: "$primaryAccount.bankAccountNo",
            bankIfsc: "$primaryAccount.bankIfsc",
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ]);

      return res.json({
        status: true,
        message: "Successfully fetched data",
        data: walletData,
        pagination: {
          totalRecords,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalRecords / limit),
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

  async UpdateStatus(req, res) {
    try {
      const { admin_id, id, status, screenshot, transactionId } = req.body;

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
      }).select("Balance DeviceToken ReferredBy");
      if (!findUser) {
        return res.json({ status: false, message: "User not found" });
      }

      // Handle Status = 1 (Accepted)
      if (status == 1) {
        const parentUser = await User_model.findOne({
          _id: admin_id,
        });

        const bonusAmount =
          paymentHistoryFind.Balance *
          (parentUser.FixedTransactionPercent / 100);

        if (parentUser && parentUser.EveryTransaction) {
          const Bonus = await BonusCollectioniModel({
            admin_id: admin_id,
            user_id: findUser._id,
            Bonus: bonusAmount,
            Type: "Every_Transaction",
          });
          await Bonus.save();
        }

        if (paymentHistoryFind.type === 0) {
          // Withdrawal Request
          if (paymentHistoryFind.Balance > findUser.Balance) {
            return res.json({ status: false, message: "Insufficient balance" });
          }

          // Deduct balance
          findUser.Balance -= paymentHistoryFind.Balance;
          paymentHistoryFind.ScreenShot = screenshot;
          paymentHistoryFind.transactionId = transactionId;
          await findUser.save();

          // Update payment history
          paymentHistoryFind.status = status;
          const data = await paymentHistoryFind.save();

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
          }

          return res.json({
            status: true,
            message: "Withdrawal request accepted successfully",
          });
        } else if (paymentHistoryFind.type === 1) {
          // Deposit Request
          // Add balance
          if (findUser.Balance === 0) {
            if (findUser && findUser.ReferredBy) {
              const ReferredByUser = await User_model.findOne({
                _id: findUser.ReferredBy,
              });

              if (ReferredByUser && ReferredByUser.Role === "USER") {
                let refferalAmount = 0;
                let balanceToAdd = paymentHistoryFind.Balance;
                if (balanceToAdd > 50 && balanceToAdd <= 100) {
                  refferalAmount = (balanceToAdd * parentUser.Range1) / 100;
                } else if (balanceToAdd > 100 && balanceToAdd <= 500) {
                  refferalAmount = (balanceToAdd * parentUser.Range2) / 100;
                } else if (balanceToAdd > 500 && balanceToAdd <= 1000) {
                  refferalAmount = (balanceToAdd * parentUser.Range3) / 100;
                } else if (balanceToAdd > 1000) {
                  refferalAmount = (balanceToAdd * parentUser.Range4) / 100;
                }

                const newStatement = new BalanceStatement({
                  userid: findUser.ReferredBy,
                  Amount: refferalAmount,
                  parent_Id: parentUser._id,
                  type: "CREDIT",
                  message: "Referral Balance Added",
                });
                await newStatement.save();
              }
            }
          }

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

          // findUser.Balance

          const balanceStatement = new BalanceStatement({
            userid: findUser._id,
            Amount: paymentHistoryFind.Balance,
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
        {
          $sort: { "balance_data.createdAt": -1 },
        },
      ]);

      // Format the `brokerage` value to 5 decimal places
      const filteredData = aggregatedData.filter(
        (item) => item.balance_data?.brokerage != 0
      );

      const formattedData = filteredData.map((item) => {
        item.balance_data.brokerage = Number(
          item.balance_data.brokerage
        ).toFixed(4);
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
      return res.json({ message: "An error occurred while updating margin." });
    }
  }

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
          // .find({ adminid, $expr: { $eq: ["$sell_lot", "$buy_lot"] } })
          .find({ adminid })

          .sort({ createdAt: -1 });
      } else {
        result = await mainorder_model
          .find({
            userid,
            // $expr: { $eq: ["$sell_lot", "$buy_lot"] },
          })
          .sort({ createdAt: -1 });
      }

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "user not found", data: [] });
      }

      const userIds = result.map((item) => item.userid);

      const users = await User_model.find({ _id: { $in: userIds } });

      const userNameMap = users.reduce((acc, user) => {
        acc[user._id] = user.UserName;
        return acc;
      }, {});

      result = result.map((item) => {
        return {
          ...item.toObject(),
          userName: userNameMap[item.userid] || "Unknown",
        };
      });

      return res.json({ status: true, message: "user found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  async getlicensedata(req, res) {
    try {
      const { userid } = req.body;
      const result = await User_model.find({ parent_id: userid })
        .select("UserName Start_Date End_Date Role parent_role")
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
      }).select("FullName UserName parent_role");
      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }
      return res.json({ status: true, message: "User found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  async AddResearch(req, res) {
    try {
      const {
        researchType,
        coin,
        price,
        targetPrice,
        stopLoss,
        entryReason,
        note,
        user_id,
        type,
      } = req.body;

      if (
        !researchType ||
        !coin ||
        !price ||
        !targetPrice ||
        !stopLoss ||
        !type
      ) {
        return res.json({
          status: false,
          message: "Missing required fields",
        });
      }

      // Check if the research type is valid
      const validResearchTypes = ["Crypto", "Forex"];

      if (!validResearchTypes.includes(researchType)) {
        return res.json({
          status: false,
          message: "Invalid research type",
        });
      }

      const MatchSymbol = await Symbol.findOne({ symbol: coin });

      if (!MatchSymbol) {
        return res.json({
          status: false,
          message: "Symbol not found",
        });
      }

      const newResearch = new ResearchModel({
        researchType,
        coin,
        price,
        targetPrice,
        stopLoss,
        entryReason,
        note,
        user_id,
        token: MatchSymbol.token,
        lotsize: MatchSymbol.lotsize,
        type,
      });

      await newResearch.save();

      return res.json({
        status: true,
        message: "Research added successfully",
        data: newResearch,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getResearch(req, res) {
    try {
      const { id } = req.query;

      const GetAllResearch = await ResearchModel.find({
        user_id: id,
      }).sort({
        createdAt: -1,
      });

      if (!GetAllResearch || GetAllResearch.length === 0) {
        return res.json({
          status: false,
          message: "No research found",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Research found",
        data: GetAllResearch,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async EditResearch(req, res) {
    try {
      const {
        id,
        researchType,
        coin,
        price,
        targetPrice,
        stopLoss,
        entryReason,
        note,
        type,
      } = req.body;

      if (!id) {
        return res.json({ status: false, message: "Research ID is required" });
      }

      // Find the research document by ID
      const research = await ResearchModel.findById(id);
      if (!research) {
        return res.json({ status: false, message: "Research not found" });
      }

      // Update the research document with new data

      research.price = price || research.price;
      research.targetPrice = targetPrice || research.targetPrice;
      research.stopLoss = stopLoss || research.stopLoss;
      research.entryReason = entryReason || research.entryReason;
      research.note = note || research.note;
      research.type = type || research.type;
      // Save the updated research document
      await research.save();

      return res.json({
        status: true,
        message: "Research updated successfully",
        data: research,
      });
    } catch (error) {}
  }

  async DeleteResearch(req, res) {
    try {
      const { id } = req.body;

      const result = await ResearchModel.findByIdAndDelete(id);
      if (!result) {
        return res.json({
          status: false,
          message: "Research not found",
        });
      }

      return res.json({
        status: true,
        message: "Research deleted successfully",
        data: result,
      });
    } catch (error) {}
  }

  async UpdatStatus(req, res) {
    try {
      const { id, status } = req.body;

      const result = await ResearchModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!result) {
        return res.json({
          status: false,
          message: "Research not found",
        });
      }

      return res.json({
        status: true,
        message: "Research status updated successfully",
        data: result,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async UpdateUpiDetails(req, res) {
    try {
      const {
        id,
        walleturl,

        qrCodeBase64,
      } = req.body;

      const GetData = await UpiDetails.findOne();

      if (!walleturl) {
        return res.json({ status: false, message: "UPI ID is required" });
      }

      if (!qrCodeBase64) {
        return res.json({ status: false, message: "QR Code is required" });
      }

      // Update the UPI details
      let updatedDetails = {
        walleturl,

        qrCodeBase64,
      };
      const updatedUpiDetails = await UpiDetails.updateOne({}, updatedDetails, {
        upsert: true,
      });

      if (!updatedUpiDetails) {
        return res.json({
          status: false,
          message: "Failed to update UPI details",
        });
      }
      return res.json({
        status: true,
        message: "UPI details updated successfully",
        data: updatedUpiDetails,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getUpiDetails(req, res) {
    try {
      const { id } = req.body;

      const GetData = await UpiDetails.findOne();
      if (!GetData) {
        return res.json({ status: false, message: "UPI details not found" });
      }

      return res.json({
        status: true,
        message: "UPI details found",
        data: GetData,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async setPrimaryBank(req, res) {
    try {
      const { id } = req.body;

      const bankDetail = await Useraccount.findById(id);
      if (!bankDetail) {
        return res.json({ status: false, message: "Bank detail not found" });
      }

      await Useraccount.updateMany(
        { userId: bankDetail.userId },
        { $set: { isPrimary: false } }
      );

      const updatedPrimaryBank = await Useraccount.findByIdAndUpdate(
        id,
        { isPrimary: true },
        { new: true }
      );

      return res.json({
        status: true,
        message: "Primary bank updated successfully",
        data: updatedPrimaryBank,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async deleteBankDetails(req, res) {
    try {
      const { id } = req.body;
      const bankDetail = await Useraccount.findById(id);
      if (!bankDetail) {
        return res.json({ status: false, message: "Bank detail not found" });
      }
      await Useraccount.findByIdAndDelete(id);
      return res.json({
        status: true,
        message: "Bank detail deleted successfully",
        data: bankDetail,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async updateBankDetails(req, res) {
    try {
      const {
        id,
        accountHolderName,
        bankName,
        bankAccountNo,
        bankIfsc,
        upiId,
      } = req.body;

      const bankDetail = await Useraccount.findById(id);
      if (!bankDetail) {
        return res.json({ status: false, message: "Bank detail not found" });
      }

      if (!accountHolderName) {
        return res.json({
          status: false,
          message: "Account Holder Name is required",
        });
      }
      if (!bankName) {
        return res.json({ status: false, message: "Bank Name is required" });
      }
      if (!bankAccountNo) {
        return res.json({
          status: false,
          message: "Bank Account Number is required",
        });
      }
      if (!bankIfsc) {
        return res.json({ status: false, message: "Bank IFSC is required" });
      }
      if (!upiId) {
        return res.json({ status: false, message: "UPI ID is required" });
      }

      // Update the bank details
      const updatedBankDetails = await Useraccount.findByIdAndUpdate(
        id,
        {
          accountHolderName,
          bankName,
          bankAccountNo,
          bankIfsc,
          upiId,
        },
        { new: true }
      );

      if (!updatedBankDetails) {
        return res.json({
          status: false,
          message: "Failed to update bank details",
        });
      }
      return res.json({
        status: true,
        message: "Bank details updated successfully",
        data: updatedBankDetails,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // 🔸 Create/Get Conversation
  async conversation(req, res) {
    try {
      const { userId, adminId } = req.body;
      let convo = await Conversation.findOne({ userId, adminId });
      if (!convo) {
        convo = new Conversation({ userId, adminId });
        await convo.save();
      }
      res.json({ success: true, conversation: convo });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // 🔸 Send Message
  async message(req, res) {
    try {
      const { conversationId, senderId, receiverId, senderType, message } =
        req.body;
      const newMsg = new Message({
        conversationId,
        senderId,
        receiverId,
        senderType,
        message,
      });
      await newMsg.save();

      const GetUser = await User_model.findById(receiverId).select(
        "DeviceToken"
      );
      if (!GetUser) {
        return res.json({
          status: false,
          message: "User not found",
        });
      }

      const { DeviceToken } = GetUser;
      // if (!DeviceToken) {
      //   return res.json({
      //     status: false,
      //     message: "DeviceToken not found",
      //   });
      // }

      sendPushNotification(
        DeviceToken ? DeviceToken : "",
        "New Message",
        message
      );

      res.json({ success: true, message: newMsg });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // 🔸 Get Messages by Conversation
  async getMessages(req, res) {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      }).sort({ timestamp: 1 });
      res.json({ success: true, messages });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // 🔸 Get Conversations for User/Admin
  async getConversations(req, res) {
    try {
      const { id } = req.params;
      const convos = await Conversation.find({
        $or: [{ userId: id }, { adminId: id }],
      });
      res.json({ success: true, conversations: convos });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async GetReferralCode(req, res) {
    try {
      const { userId } = req.body;
      const user = await User_model.findById(userId).select("ReferralCode");
      if (!user) {
        return res.json({
          status: false,
          message: "User not found",
          data: [],
        });
      }

      const referralCode = user.ReferralCode;

      if (!referralCode) {
        return res.json({
          status: false,
          message: "Referral code not found",
          data: [],
        });
      }

      let GerReferUser = await Sign_In.find({
        referred_by: user._id,
      });

      let GetCompany = await Company.find();
      return res.json({
        status: true,
        message: "Referral code found",
        referralCode: referralCode,
        data: GerReferUser,
        url: GetCompany[0]?.loginUrl + "/" + referralCode,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async UpdateReferPrice(req, res) {
    try {
      const { userId, Range1, Range2, Range3, Range4 } = req.body;

      if (!userId || !Range1 || !Range2 || !Range3 || !Range4) {
        return res.json({
          status: false,
          message: "User ID and All Range Required",
        });
      }

      const user = await User_model.findById(userId);
      if (!user) {
        return res.json({ status: false, message: "User not found" });
      }

      user.Range1 = Range1;
      user.Range2 = Range2;
      user.Range3 = Range3;
      user.Range4 = Range4;

      await user.save();

      return res.json({
        status: true,
        message: "Referral price updated successfully",
        data: user,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // async Downloadapk(req, res) {
  //   res.download(apkPath, "application.apk", (err) => {
  //     if (err) {
  //       res.status(500).send("Error downloading file");
  //     }
  //   });
  // }

  async Downloadapk(req, res) {
    // Optionally, set content type header (APK ka mime type hai application/vnd.android.package-archive)
    res.setHeader("Content-Type", "application/vnd.android.package-archive");

    res.download(apkPath, "application.apk", (err) => {
      if (err) {
        return res.send("Error downloading file");
      }
    });
  }

  async GetBonusDetails(req, res) {
    try {
      const { admin_id } = req.body;

      if (!admin_id) {
        return res.json({
          status: false,
          message: "Admin ID is required",
          data: [],
        });
      }

      const bonusDetails = await BonusCollectioniModel.aggregate([
        {
          $match: {
            admin_id: new mongoose.Types.ObjectId(admin_id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $project: {
            Bonus: 1,
            Type: 1,
            username: "$userDetails.UserName",
            user_id: 1,
            admin_id: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      const ProfitBalanceTotal = await User_model.findOne({
        _id: admin_id,
      }).select("ProfitBalance");

      if (!bonusDetails || bonusDetails.length === 0) {
        return res.json({
          status: false,
          message: "No bonus details found",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Bonus details found",
        data: bonusDetails,
        CompletedBrokrageandBonus: ProfitBalanceTotal?.ProfitBalance || 0,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getAllUser(req, res) {
    try {
      const { id, search, ActiveStatus } = req.body;
      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.limit) || 1000;
      const skip = (page - 1) * limit;

      if (!id) {
        return res
          .status(400)
          .json({ status: false, message: "Parent ID is required", data: [] });
      }
      const filter = {
        parent_id: id,
        Role: "USER",
      };

      // Apply ActiveStatus filter if provided
      if (ActiveStatus === "Active" || ActiveStatus === "Inactive") {
        filter.ActiveStatus = ActiveStatus == "Active" ? "1" : "0";
      }

      if (search) {
        const regex = new RegExp(search, "i");
        filter.$or = [
          { FullName: regex },
          { Email: regex },
          { UserName: regex },
        ];
      }

      console.log("Filter:", filter);

      // Fetch filtered and paginated users
      const result = await User_model.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCount = await User_model.countDocuments(filter);

      return res.json({
        status: true,
        message: "Data fetched successfully",
        data: result,
        pagination: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          limit,
        },
      });
    } catch (error) {
      console.error("Error in getAllUser:", error);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error", data: [] });
    }
  }
}

module.exports = new Admin();
