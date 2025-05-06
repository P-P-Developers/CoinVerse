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
        return res.send({
          status: false,
          message: "User not exists",
          data: [],
        });
      }

      if (EmailCheck.ActiveStatus !== "1") {
        return res.send({
          status: false,
          message: "Account is not active",
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
            message: "Account is expired",
            data: [],
          });
        }
      }

      const validPassword = await bcrypt.compare(password, EmailCheck.password);
      if (!validPassword) {
        return res.send({
          status: false,
          message: "Password not match",
          data: [],
        });
      }

      // Check if pin_status is false
      if (EmailCheck.Role === "USER" && !EmailCheck.pin_status) {
        return res.send({
          status: false,
          message: "Generate your PIN first",
          user_id: EmailCheck._id,
        });
      }

      // JWT Token creation
      var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
        expiresIn: 28800,
      });

      // Create user login log
      const user_login = new user_logs({
        user_Id: EmailCheck._id,
        admin_Id: EmailCheck.parent_id || "",
        UserName: EmailCheck.UserName,
        login_status: "Panel On",
        role: EmailCheck.Role,
        DeviceToken: fcm_token,
      });

      await user_login.save();

      // Update FCM token if role is USER
      if (EmailCheck.Role === "USER") {
        const Update_fcm_token = await User_model.findByIdAndUpdate(
          EmailCheck._id,
          {
            DeviceToken: fcm_token,
          },
          { new: true }
        );
      }

      // Send successful login response with JWT and user details
      return res.send({
        status: true,
        msg: "Login successfully",
        data: {
          token: token,
          Role: EmailCheck.Role,
          user_id: EmailCheck._id,
          UserName: EmailCheck.UserName,
          ReferralCode: EmailCheck.ReferralCode,
          ReferredBy: EmailCheck.ReferredBy,
          parent_id: EmailCheck.parent_id,
        },
      });
    } catch (error) {
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }

  // ----Original code----

  // ------------------------------------------------------
  // // My testing with the code


async SignIn(req, res) {
  try {
    const { FullName, UserName, PhoneNo, password, ReferredBy } = req.body;

    // Check required fields
    if (!FullName || !UserName || !PhoneNo || !password) {
      return res.json({
        status: false,
        message: "Missing required fields",
        data: [],
      });
    }

    // Check if username already exists
    const existingUser = await User_model.findOne({ UserName });
    if (existingUser) {
      return res.json({
        status: false,
        message: "Username already exists",
        data: [],
      });
    }

    // Validate referral code
    let referredUser = null;
    let referral_price = 0;

    if (ReferredBy) {
      referredUser = await User_model.findOne({ ReferralCode: ReferredBy });
      if (!referredUser) {
        return res.json({
          status: false,
          message: "Invalid referral code",
          data: [],
        });
      }

      // Get parent user's referral price
      if (referredUser.parent_id) {
        const parentUser = await User_model.findById(referredUser.parent_id);
        if (!parentUser) {
          return res.json({
            status: false,
            message: "Parent user not found",
            data: [],
          });
        }
        console.log("Parent User:",  parentUser?.Refer_Price);
        referral_price = parentUser?.Refer_Price || 0;
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user record
    const signinuser = new Sign_In({
      FullName,
      UserName,
      PhoneNo,
      password: hashedPassword,
      referred_by: referredUser ? referredUser._id : null,
      referral_price:referral_price ? Number(referral_price) : 0,
    });

    const result = await signinuser.save();

    if (!result) {
      return res.json({
        status: false,
        message: "Unable to sign in",
        data: [],
      });
    }

    return res.json({
      status: true,
      message: "Signed in successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in SignIn:", error);
    return res.json({
      status: false,
      message: "Internal error",
      data: [],
    });
  }
}


  async getSignIn(req, res) {
    try {
      const { admin_id } = req.body;

      // Step 1: Get all user IDs under this admin
      const GetAllUsers = await User_model.find({
        parent_id: admin_id,
        Role: "USER",
      }).select("_id");

      const AllUserId = GetAllUsers.map((item) => item._id);

      // Step 2: Find sign-ins directly referred by the admin
      const result = await Sign_In.find({
        referred_by: admin_id,
        isActive: false,
      }).sort({ createdAt: -1 });

      // Step 3: Find sign-ins referred by the admin’s users
      const result1 = await Sign_In.find({
        referred_by: { $in: AllUserId },
        isActive: false,
      }).sort({ createdAt: -1 });

      // Step 4: Merge and check the results
      const finalData = [...result, ...result1];

      if (finalData.length === 0) {
        return res.json({ status: false, message: "No data found", data: [] });
      }

      return res.json({
        status: true,
        message: "Data retrieved",
        data: finalData,
      });
    } catch (error) {
      console.error("Error in getSignIn:", error);
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

      return res.send({
        status: true,
        message: "Logout Succesfully",
        data: [],
      });
    } catch (error) {}
  }

  // get logoutUser data

  // async getlogsuser(req, res) {
  //   try {
  //     const { userid } = req.body;

  //     const result = await user_logs
  //       .find({ admin_Id: userid })
  //       .sort({ createdAt: -1 });

  //     if (!result) {
  //       return res.send({ status: false, message: "user not found", data: [] });
  //     }
  //     return res.send({ status: true, message: "user sucess", data: result });
  //   } catch (error) {
  //     return res.send({ status: false, message: "internal error", data: [] });
  //   }
  // }

  async getlogsuser(req, res) {
    try {
      const { userid } = req.body;
  
      const result = await user_logs.aggregate([
        {
          $match: { admin_Id: new mongoose.Types.ObjectId(userid) }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'admin_Id',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            parent_role: "$userDetails.parent_role"
          }
        },
        {
          $project: {
            userDetails: 0 // optional: exclude the entire joined object if not needed
          }
        }
      ]);
  
      return res.send({
        status: true,
        message: "user success",
        data: result
      });
  
    } catch (error) {
      console.error("Error in getlogsuser:", error);
      return res.send({
        status: false,
        message: "internal error",
        data: []
      });
    }
  }
  
  

  // change password

  async PasswordChanged(req, res) {
    try {
      const { userid, oldPassword, newPassword } = req.body;

      const user = await User_model.findOne({ _id: userid });

      if (!user) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      const validPassword = await bcrypt.compare(oldPassword, user.password);

      if (!validPassword) {
        return res.json({
          status: false,
          message: "Old password does not match",
          data: [],
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword.toString(), salt);

      await User_model.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
          Otp: newPassword,
        },
        { new: true }
      );

      return res.json({
        status: true,
        message: "Password updated successfully",
      }); // Return the updated user
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }
}

module.exports = new Auth();
