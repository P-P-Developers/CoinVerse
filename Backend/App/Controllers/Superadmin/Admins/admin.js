"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const { findOne } = require("../../../Models/Role.model");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const totalLicense = db.totalLicense

class Superadmin {


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
        Balance,
        Licence,
        pertrade,
        perlot,
        turn_over_percentage,
        brokerage,
        limit,
      } = req.body;

      if (!FullName || !UserName || !Email || !PhoneNo || !password || !Role) {
        return res.json({ status: false, message: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await User_model.findOne({
        $or: [{ UserName }, { Email }, { PhoneNo }],
      });

      if (existingUser) {
        if (existingUser.UserName === UserName) {
          return res.send({
            status: false,
            message: "Username already exists",
            data: [],
          });
        }

        if (existingUser.Email === Email) {
          return res.send({
            status: false,
            message: "Email already exists",
            data: [],
          });
        }

        if (existingUser.PhoneNo === PhoneNo) {
          return res.send({
            status: false,
            message: "Phone Number already exists",
            data: [],
          });
        }
      }

      
      // Hash password
      var rand_password = Math.round(password);
      const salt = await bcrypt.genSalt(10);
      var hashedPassword = await bcrypt.hash(rand_password.toString(), salt);

      // Create new user
      const newUser = new User_model({
        FullName,
        UserName,
        Email,
        PhoneNo,
        parent_id,
        parent_role,
        Balance,
        Otp,
        Role,
        pertrade,
        perlot,
        turn_over_percentage,
        brokerage,
        limit,
        password: hashedPassword,
      });

      await newUser.save();

      let userWallet = new Wallet_model({
        user_Id: newUser._id,
        Balance: Balance,
        parent_Id:parent_id
      });
      await userWallet.save();

      return res.json({
        status: true,
        message: "Users added successfully",
        data: newUser,
      });
    } catch (error) {
    
      res.json({ status: false, message: "Failed to add User", data: [] });
    }
  }

  //updated balance

  async walletRecharge(req, res) {
    try {
      const { id, Balance,parent_Id } = req.body;

      const userdata = await User_model.findOne({ _id: id });
      if (!userdata) {
        return res.json({
          status: false,
          message: "Wallet not found",
          data: [],
        });
      }

      const newBalance = Number(userdata.Balance || 0) + Number(Balance);
      const result1 = await User_model.updateOne(
        { _id: userdata._id },
        { $set: { Balance: newBalance } }
      );

      const result = new Wallet_model({
        user_Id: userdata._id,
        Balance: Balance,
        parent_Id:parent_Id
      });
      await result.save();

      return res.json({
        status: true,
        message: "Balance is updated",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  // get all admin detail

  async getAdminDetail(req, res) {
    try {
      const { id } = req.body;

      const result = await User_model.find({ parent_id: id });

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


  
  // update status

  async UpdateActiveStatusAdmin(req, res) {
    try {
      const { id, user_active_status } = req.body;
      // UPDATE ACTTIVE STATUS CLIENT
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
            parent_Id:1,
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


// update admin 
  async Update_Admin(req, res) {
    try {
      const data = req.body;
      const id = req.body.id;

      const filter = { _id: id ,Role:"ADMIN"};
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
        Role:"ADMIN",
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




}

module.exports = new Superadmin();
