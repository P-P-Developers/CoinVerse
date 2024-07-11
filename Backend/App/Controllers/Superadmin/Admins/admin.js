"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const User_model = db.user;
const Role = db.role




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
      } = req.body;


      if (!FullName || !UserName || !Email || !PhoneNo || !password || !Role) {
        return res
          .json({ status: false, message: "Missing required fields" });
      }



      // IF USER ALEARDY EXIST
      const existingUser = await User_model.findOne({
        $or: [{ UserName: UserName }, { Email: Email }, { PhoneNo: PhoneNo }],
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
          

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User_model({
        FullName,
        UserName,
        Email,
        PhoneNo,
        parent_id,
        parent_role,
        Otp,
        Role :Role.toUpperCase(),
        password: hashedPassword,
      });


      await newUser.save();
      return res
        .json({
          status: true,
          message: "Admin added successfully",
          data: newUser,
        });
    } catch (error) {
      console.error("Error adding admin:", error);
      res
        .json({ status: false, message: "Failed to add admin", data: [] });
    }
  }

   

 // adding Role
async addRoles(req, res) {
  try {
    const { role, name, description } = req.body;
    const newRole = new Role({
      role,
      name,
      description
    });

    const result = await newRole.save();

    if (!result) {
      return res.json({ status: false, message: "Not added", data: [] });
    }


    return res.json({ status: true, message: "Role added successfully", data: result });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
}





}

module.exports = new Superadmin();
