"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const totalLicense = db.totalLicense;

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
        Licence,
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
        parent_Id: parent_id,
      });
      await userWallet.save();

      let licence = new totalLicense({
        user_Id: newUser._id,
        Licence: Licence,
        parent_Id: parent_id,
      });

      await licence.save();

      return res.json({
        status: true,
        message: "Users added successfully",
        data: newUser,
      });
    } catch (error) {
      res.json({ status: false, message: "Failed to add User", data: [] });
    }
  }

  // update Licence

  async updateLicence(req, res) {
    try {
      const { id, Licence, parent_Id } = req.body;

      const userdata = await User_model.findOne({ _id: id });
      if (!userdata) {
        return res.json({
          status: false,
          message: "Licence not found",
          data: [],
        });
      }

      const newLicence = Number(userdata.Licence || 0) + Number(Licence);
      const result1 = await User_model.updateOne(
        { _id: userdata._id },
        { $set: { Licence: newLicence } }
      );

      const result = new totalLicense({
        user_Id: userdata._id,
        Licence: Licence,
        parent_Id: parent_Id,
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

  async updateUser(req, res) {
    try {
      const { id, perlot, pertrade, brokerage, turn_over_percentage, ...rest } =
        req.body;

      const values = [perlot, pertrade, brokerage, turn_over_percentage];
      const nonZeroValues = values.filter(
        (value) => value !== undefined && value !== 0
      );

      if (nonZeroValues.length > 1) {
        return res.status(400).send({
          status: false,
          msg: "Only one of perlot, pertrade, brokerage, or turn_over_percentage can have a non-zero value",
        });
      }

      // Set other fields to zero if one field is non-zero
      let dataToUpdate = {
        perlot: 0,
        pertrade: 0,
        brokerage: 0,
        turn_over_percentage: 0,
        ...rest,
      };

      if (perlot !== undefined) {
        dataToUpdate.perlot = perlot;
      } else if (pertrade !== undefined) {
        dataToUpdate.pertrade = pertrade;
      } else if (brokerage !== undefined) {
        dataToUpdate.brokerage = brokerage;
      } else if (turn_over_percentage !== undefined) {
        dataToUpdate.turn_over_percentage = turn_over_percentage;
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
        return res
          .status(404)
          .send({ status: false, msg: "Data not updated", data: [] });
      }

      return res.send({
        status: true,
        msg: "Data updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Internal error:", error);
      return res
        .status(500)
        .send({ status: false, msg: "Internal server error" });
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

  // Employee updare

  async Update_Employe(req, res) {
    try {
      const data = req.body;
      const id = req.body.id;

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
        Role:"EMPLOYE",
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

module.exports = new Admin();
