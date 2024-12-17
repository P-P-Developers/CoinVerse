"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const jwt = require("jsonwebtoken");
const User_model = db.user;
const Sign_In = db.Sign_In;
const totalLicense = db.totalLicense;
const user_logs = db.user_logs;

class Auth {


  async login(req, res) {
    try {
      const { UserName, password, fcm_token } = req.body;
      const EmailCheck = await User_model.findOne({ UserName: UserName });


      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }



      if (EmailCheck.ActiveStatus !== "1") {
        return res.send({
          status: false,
          msg: "Account is not active",
          data: [],
        });
      }

      if (EmailCheck.Role === "USER" || EmailCheck.Role === "ADMIN") {
        const currentDate = new Date();
        const endDate = new Date(EmailCheck.End_Date);

        if (
          endDate.getDate() === currentDate.getDate() &&
          endDate.getMonth() === currentDate.getMonth() &&
          endDate.getFullYear() === currentDate.getFullYear()
        ) {
          return res.send({
            status: false,
            msg: "Account is expired",
            data: [],
          });
        }
      }

      const validPassword = await bcrypt.compare(password, EmailCheck.password);
      // console.log("password is :",validPassword); //if correct then return true;

      if (!validPassword) {
        return res.send({ status: false, message: "Password Not Match", data: [] });
      }

      // JWT TOKEN CREATE
      var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
        expiresIn: 28800,
      });

      // console.log("Token is ", token);

      const user_login = new user_logs({
        user_Id: EmailCheck._id,
        admin_Id: EmailCheck.parent_id || "",
        UserName: EmailCheck.UserName,
        login_status: "Panel On",
        role: EmailCheck.Role,
        DeviceToken: fcm_token,
      });
      // console.log("User is ", user_login);

      await user_login.save();

      if (EmailCheck.Role === "USER") {

        const Update_fcm_token = await User_model.findByIdAndUpdate(

          EmailCheck._id,
          {
            fcm_token: fcm_token,
          },
          { new: true }
        );
      }

      return res.send({
        status: true,
        msg: "Login Successfully",
        data: {
          token: token,
          Role: EmailCheck.Role,
          user_id: EmailCheck._id,
          UserName: EmailCheck.UserName,
          ReferralCode: EmailCheck.ReferralCode,  // Add ReferralCode here
          ReferredBy: EmailCheck.ReferredBy,
        },
      });
    } catch (error) {
      res.send({ status: false, msg: "Server Side error", data: error });
    }
  }



  // ----Original code----
  // async SignIn(req, res) {
  //   try {
  //     const { FullName, UserName, PhoneNo, password } = req.body;

  //     if (!FullName || !UserName || !PhoneNo || !password) {
  //       return res.json({
  //         status: false,
  //         message: "Missing required fields",
  //         data: [],
  //       });
  //     }

  //     // Check if username already exists
  //     const existingUsers = await User_model.find({
  //       UserName: { $in: [UserName] },
  //     });

  //     if (existingUsers.length > 0) {
  //       return res.json({
  //         status: false,
  //         message: "Username already exists",
  //         data: [],
  //       });
  //     }

  //     // Create new user
  //     const signinuser = new Sign_In({
  //       FullName,
  //       UserName,
  //       password,
  //       PhoneNo,
  //     });

  //     const result = await signinuser.save();

  //     if (!result) {
  //       return res.json({
  //         status: false,
  //         message: "Unable to sign in",
  //         data: [],
  //       });
  //     }

  //     return res.json({
  //       status: true,
  //       message: "Signed in successfully",
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.error(error); // Log the error for debugging
  //     return res.json({
  //       status: false,
  //       message: "Internal error",
  //       data: [],
  //     });
  //   }
  // }

  // ------------------------------------------------------
  // // My testing with the code
  async SignIn(req, res) {
    try {
      const { FullName, UserName, PhoneNo, password, ReferredBy } = req.body;

      // Check for missing required fields
      if (!FullName || !UserName || !PhoneNo || !password) {
        return res.json({
          status: false,
          message: "Missing required fields",
          data: [],
        });
      }

      // Check if username already exists
      const existingUsers = await User_model.find({
        UserName: { $in: [UserName] },
      });

      if (existingUsers.length > 0) {
        return res.json({
          status: false,
          message: "Username already exists",
          data: [],
        });
      }

      // Check if referral code is provided and valid
      let referredUser = null;
      if (ReferredBy) {
        referredUser = await User_model.findOne({ ReferralCode: ReferredBy });
        if (!referredUser) {
          return res.json({
            status: false,
            message: "Invalid referral code",
            data: [],
          });
        }
      }

      // Create new user
      const signinuser = new Sign_In({
        FullName,
        UserName,
        password,
        PhoneNo,
        referred_by: referredUser ? referredUser._id : null, // Store the referring user's ID
      });

      const result = await signinuser.save();

      if (!result) {
        return res.json({
          status: false,
          message: "Unable to sign in",
          data: [],
        });
      }

      // Optionally, you could update the referred user's record to track the referral if needed

      return res.json({
        status: true,
        message: "Signed in successfully",
        data: result,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }


  // --------------------------  
  async getSignIn(req, res) {
    try {
      const { admin_id } = req.body;
      const result = await Sign_In.find({ referred_by: admin_id }).sort({ createdAt: -1 });

      if (!result) {
        return res.json({ status: false, message: "data not found", data: [] });
      }

      return res.json({ status: true, message: "finding data ", data: result });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  // log out user

  async logoutUser(req, res) {
    try {
      const { userid } = req.body;

      const user_detail = await User_model.findOne({ _id: userid });


      const user_login = new user_logs({
        user_Id: user_detail._id,
        admin_Id: user_detail.parent_id,
        UserName: user_detail.UserName,
        login_status: "Panel off",
        role: user_detail.Role,
      });
      await user_login.save();

      return res.send({ status: true, msg: "Logout Succesfully", data: [] });
    } catch (error) { }
  }



  // get logoutUser data
  async getlogsuser(req, res) {
    try {
      const { userid } = req.body;

      const result = await user_logs.find({ admin_Id: userid }).sort({ createdAt: -1 });;

      if (!result) {
        return res.send({ status: false, message: "user not found", data: [] });
      }
      return res.send({ status: true, message: "user sucess", data: result });
    } catch (error) {
      return res.send({ status: false, message: "internal error", data: [] });
    }
  }


  // change password

  async PasswordChanged(req, res) {
    try {
      const { userid, oldPassword, newPassword } = req.body;

      const user = await User_model.findOne({ _id: userid });

      if (!user) {
        return res.json({ status: false, message: 'User not found', data: [] });
      }

      const validPassword = await bcrypt.compare(oldPassword, user.password);

      if (!validPassword) {
        return res.json({ status: false, message: 'Old password does not match', data: [] });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword.toString(), salt);

      await User_model.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
          Otp: newPassword
        },
        { new: true }
      );

      return res.json({ status: true, message: "Password updated successfully" }); // Return the updated user

    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }


}

module.exports = new Auth();
