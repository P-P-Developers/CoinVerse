"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const totalLicense = db.totalLicense;
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const MarginRequired = db.MarginRequired;
const Symbol = db.Symbol;
const BalanceStatement = db.BalanceStatement;
const mainorder_model = db.mainorder_model;
const employee_model =db.employee_model


class employee{


    async employee_request(req, res) {
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
            Employee,
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
    
          // Create new user
          const newUser = new employee_model({
            FullName,
            UserName,
            Email,
            PhoneNo,
            employee:Employee,
            parent_id,
            parent_role,
            Balance,
            Otp: password,
            Role,
            Licence,
            pertrade,
            perlot,
            turn_over_percentage,
            brokerage,
            limit,
            password,
          });
    
          await newUser.save();
    
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

}

module.exports = new employee();