"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const { findOne } = require("../../../Models/Role.model");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;



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
            msg: "Username already exists",
            data: [],
          });
        }

        if (existingUser.Email === Email) {
          return res.send({
            status: false,
            msg: "Email already exists",
            data: [],
          });
        }

        if (existingUser.PhoneNo === PhoneNo) {
          return res.send({
            status: false,
            msg: "Phone Number already exists",
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
        password:hashedPassword,
      });

      await newUser.save();


      // add balance 
      try {

        let userWallet = await Wallet_model.findOne({user_id:newUser._id });

        if (userWallet) {
          userWallet.balance += Balance;
          await userWallet.save();

        } else {
          userWallet = new Wallet_model({
            user_id: newUser._id,
            Balance: Balance,
            Name: FullName,
          });
          await userWallet.save();
        }

      } catch (walletError) {
        return res.json({
          status: true,
          message: "Admin added successfully, but wallet handling failed",
          data: newUser,
          walletError: walletError.message,
        });
      }

      return res.json({
        status: true,
        message: "Admin added successfully",
        data: newUser,
      });


    } catch (error) {
      console.error("Error adding admin:", error);
      res.json({ status: false, message: "Failed to add admin", data: [] });
    }
  }



       //updated balance

     async walletRecharge(req, res) {
        try {
          const { id, Balance } = req.body;
      
          const wallet = await Wallet_model.findOne({_id: id});
          if (!wallet) {

            return res.json({ status: false, message: "Wallet not found", data: [] });

          }
      
          const newBalance = Number(wallet.Balance)  +  Number(Balance);
          const result = await Wallet_model.updateOne(
            { _id: id },
            { $set: { Balance: newBalance } }

          );
      
          if (result.nModified === 0) {
            return res.json({ status: false, message: "Not updated", data: [] });
          }
      
          return res.json({
            status: true,
            message: "Balance is updated",
            data: result,
          });

        } catch (error) {
          return res.json({ status: false, message: "Internal error", data: [] });
        }
      }




      async getAdminDetail(req, res) {
        try {
          const { id } = req.body;
      
          const result = await User_model.find({ parent_id: id, Role: "ADMIN" });
      
          if (!result || result.length === 0) {
            return res.json({ status: false, message: "Data not found", data: [] });
          }
      
          return res.json({
            status: true,
            message: "getting data",
            data: result
          });
      
        } catch (error) {
          console.error("Error fetching admin details:", error);
          return res.json({ status: false, message: "Internal error", data: [] });
        }
      }
      


}


module.exports = new Superadmin();
