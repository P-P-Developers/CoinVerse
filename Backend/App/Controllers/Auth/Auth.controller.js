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
const axios = require("axios");

class Auth {
  async login(req, res) {
    try {
      const { UserName, password, fcm_token } = req.body;
      console.log("Login-", fcm_token);

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
      var token = jwt.sign(
        {
          id: EmailCheck._id,
          token: token,
          Role: EmailCheck.Role,
          user_id: EmailCheck._id,
          UserName: EmailCheck.UserName,
          ReferralCode: EmailCheck.ReferralCode,
          ReferredBy: EmailCheck.ReferredBy,
          parent_id: EmailCheck.parent_id,
        },
        process.env.SECRET,
        {
          expiresIn: 28800,
        }
      );

      res.cookie("token", token, {
        httpOnly: false,
        secure: false, 
        sameSite: "Lax",
        maxAge: 12 * 60 * 60 * 1000, 
      });

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

  async SignIn(req, res) {
    try {
      const { FullName, UserName, PhoneNo, Email, password, ReferredBy } =
        req.body;

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
      let parentUser = null;

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
          parentUser = await User_model.findById(referredUser.parent_id);
          if (!parentUser) {
            return res.json({
              status: false,
              message: "Parent user not found",
              data: [],
            });
          }

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
        password: password,
        referred_by: referredUser ? referredUser._id : null,
        referral_price: referral_price ? Number(referral_price) : 0,
      });

      const result = await signinuser.save();

      if (!result) {
        return res.json({
          status: false,
          message: "Unable to sign in",
          data: [],
        });
      }

      const data = {
        FullName,
        UserName,
        Email,
        PhoneNo,
        employee_id: "",
        Balance: 0,
        password: password,
        parent_role:
          referredUser.Role === "ADMIN"
            ? referredUser.Role
            : referredUser?.parent_role,
        parent_id:
          referredUser.Role === "ADMIN"
            ? referredUser._id
            : referredUser.parent_id,
        Role: "USER",
        limit: 100,
        Licence: 1,
        perlot: 1,
        referred_by: referredUser ? referredUser._id : null,
      };

      const response = await axios.post(
        process.env.base_url + "admin/AddUser",
        data
      );

      if (!response.data.status) {
        return res.json({
          status: false,
          message: response.data.message,
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Signed in successfully",
        data: result,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }

  async DeleteSignIn(req, res) {
    try {
      const { id } = req.body;
      const result = await Sign_In.findByIdAndDelete(id);

      if (!result) {
        return res.json({
          status: false,
          message: "Unable to delete",
          data: [],
        });
      }

      return res.json({
        status: true,
        message: "Deleted successfully",
        data: [],
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
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

  async getlogsuser(req, res) {
    try {
      const { userid } = req.body;

      const result = await user_logs.aggregate([
        {
          $match: { admin_Id: new mongoose.Types.ObjectId(userid) },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_Id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            parent_role: "$userDetails.parent_role",
          },
        },
        {
          $project: {
            userDetails: 0, // optional: exclude the entire joined object if not needed
          },
        },
      ]);

      return res.send({
        status: true,
        message: "user success",
        data: result,
      });
    } catch (error) {
      console.error("Error in getlogsuser:", error);
      return res.send({
        status: false,
        message: "internal error",
        data: [],
      });
    }
  }

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

  async getReferClients(req, res) {
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
      }).sort({ createdAt: -1 });

      // Step 3: Find sign-ins referred by the admin’s users
      const result1 = await Sign_In.find({
        referred_by: { $in: AllUserId },
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

  async generatePin(req, res) {
    try {
      const { user_id, pin } = req.body;

      // Validate that the pin is exactly 4 digits if it's provided
      if (pin && !/^\d{4}$/.test(pin)) {
        return res.send({
          status: false,
          message: "Pin must be a 4-digit number",
          data: [],
        });
      }

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      user.pin = pin;
      user.pin_status = true;

      await user.save();

      return res.send({
        status: true,
        message: "Pin generated successfully",
        data: { user_id: user._id },
      });
    } catch (error) {
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }

  async matchPin(req, res) {
    try {
      const { user_id, pin, fcm_token } = req.body;
      console.log("matchPin Auth-", fcm_token);

      if (pin && !/^\d{4}$/.test(pin)) {
        return res.send({ status: false, message: "Invalid PIN", data: [] });
      }

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      if (user.ActiveStatus !== "1") {
        return res.send({
          status: false,
          message: "Account is not active",
          data: [],
        });
      }

      if (user.Role === "USER" || user.Role === "ADMIN") {
        const currentDate = new Date();
        const endDate = new Date(user.End_Date);

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

      // If pin_status is false, return a message to generate the pin first
      if (!user.pin_status) {
        return res.send({
          status: false,
          message: "Please generate your PIN first",
          data: [],
        });
      }

      // Compare the entered pin with the stored pin
      if (user.pin !== pin) {
        return res.send({ status: false, message: "Incorrect pin", data: [] });
      }

      var token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 28800,
      });

      // Create user login log
      const user_login = new user_logs({
        user_Id: user._id,
        admin_Id: user.parent_id || "",
        UserName: user.UserName,
        login_status: "Panel On",
        role: user.Role,
        DeviceToken: "",
      });

      await user_login.save();

      return res.send({
        status: true,
        message: "Pin matched successfully",
        data: {
          token: token,
          Role: user.Role,
          user_id: user._id,
          UserName: user.UserName,
          ReferralCode: user.ReferralCode,
          ReferredBy: user.ReferredBy,
          parent_id: user.parent_id,
        },
      });
    } catch (error) {
      console.error("Error in matchPin:", error);
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }

  async FingerAuth(req, res) {
    try {
      const { user_id, fcm_token } = req.body;
      console.log("Login Auth-", fcm_token);

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      if (user.ActiveStatus !== "1") {
        return res.send({
          status: false,
          message: "Account is not active",
          data: [],
        });
      }

      if (user.Role === "USER" || user.Role === "ADMIN") {
        const currentDate = new Date();
        const endDate = new Date(user.End_Date);

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

      // If pin_status is false, return a message to generate the pin first
      if (!user.pin_status) {
        return res.send({
          status: false,
          message: "Please generate your PIN first",
          data: [],
        });
      }

      var token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 28800,
      });

      // Create user login log
      const user_login = new user_logs({
        user_Id: user._id,
        admin_Id: user.parent_id || "",
        UserName: user.UserName,
        login_status: "Panel On",
        role: user.Role,
        DeviceToken: "",
      });

      await user_login.save();

      return res.send({
        status: true,
        message: "Pin matched successfully",
        data: {
          token: token,
          Role: user.Role,
          user_id: user._id,
          UserName: user.UserName,
          ReferralCode: user.ReferralCode,
          ReferredBy: user.ReferredBy,
          parent_id: user.parent_id,
        },
      });
    } catch (error) {
      console.error("Error in matchPin:", error);
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }

  async changePin(req, res) {
    try {
      const { user_id, pin, newPin, confirmNewPin } = req.body;

      if (pin && !/^\d{4}$/.test(pin)) {
        return res.send({
          status: false,
          message: "Invalid Old PIN",
          data: [],
        });
      }
      // Validate the new PIN and confirm PIN to ensure they're 4
      if (!/^\d{4}$/.test(newPin)) {
        return res.send({
          status: false,
          message: "Invalid New PIN",
          data: [],
        });
      }

      if (newPin !== confirmNewPin) {
        return res.send({
          status: false,
          message: "New Pin and Confirm Pin don't match",
          data: [],
        });
      }

      const user = await User_model.findById(user_id);

      if (!user) {
        return res.send({ status: false, message: "User not found", data: [] });
      }

      if (!user.pin_status) {
        return res.send({
          status: false,
          message: "Please generate your PIN first",
          data: [],
        });
      }

      if (user.pin !== pin) {
        return res.send({
          status: false,
          message: "Incorrect Old PIN",
          data: [],
        });
      }

      if (newPin === pin) {
        return res.send({
          status: false,
          message: "New PIN cannot be the same as the old PIN",
          data: [],
        });
      }

      user.pin = newPin;
      await user.save();

      return res.send({
        status: true,
        message: "PIN updated successfully",
        data: [],
      });
    } catch (error) {
      return res.send({
        status: false,
        message: "Server side error",
        data: error,
      });
    }
  }

  async ForgotPin(req, res) {
    try {
      const { user_id, password, newPin } = req.body;

      if (!user_id || !password || !newPin) {
        return res.status(400).send({
          status: false,
          message: "Missing required fields",
          data: [],
        });
      }

      const user = await User_model.findOne({ _id: user_id });

      if (!user) {
        return res.status(404).send({
          status: false,
          message: "User does not exist",
          data: [],
        });
      }

      if (user.ActiveStatus !== "1") {
        return res.status(403).send({
          status: false,
          message: "Account is not active",
          data: [],
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send({
          status: false,
          message: "Incorrect password",
          data: [],
        });
      }

      if (!/^\d{4}$/.test(newPin)) {
        return res.status(400).send({
          status: false,
          message: "New PIN must be a 4-digit number",
          data: [],
        });
      }

      user.pin = newPin;
      user.pin_status = true;
      await user.save();

      return res.status(200).send({
        status: true,
        message: "PIN updated successfully",
        data: [],
      });
    } catch (error) {
      console.error("ForgotPin error:", error);
      return res.status(500).send({
        status: false,
        message: "Internal server error",
        data: error,
      });
    }
  }
}

module.exports = new Auth();
