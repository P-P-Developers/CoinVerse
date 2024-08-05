"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const jwt = require("jsonwebtoken");
const User_model = db.user;
const Sign_In = db.Sign_In;
const totalLicense = db.totalLicense;
const user_logs  = db.user_logs


class Auth {

    async login(req, res) {

      try {
        const { UserName, password } = req.body;
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
            return res.send({ status: false, msg: "Account is expired", data: [] });
          }
        }
    
        const validPassword = await bcrypt.compare(password, EmailCheck.password);

        if (!validPassword) {
          return res.send({ status: false, msg: "Password Not Match", data: [] });
        }

        // JWT TOKEN CREATE
        var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
          expiresIn: 36000,
        });
         
        const user_login = new user_logs({
          user_Id: EmailCheck._id,
          admin_Id: EmailCheck.parent_id,
          login_status:"Panel On",
          role: EmailCheck.Role,
         

      })
          await user_login.save();

        return res.send({
          status: true,
          msg: "Login Successfully",
          data: {
            token: token,
            Role: EmailCheck.Role,
            user_id: EmailCheck._id,
            UserName: EmailCheck.UserName,
          },
        });
      } catch (error) {
        res.send({ status: false, msg: "Server Side error", data: error });
      }
    }


  async SignIn(req, res) {
    try {
      const { FullName, UserName, PhoneNo, password } = req.body;
       
     
      if (!FullName || !UserName || !PhoneNo || !password) {
        return res.json({
          status: false,
          message: "Missing required fields",
          data: [],
        });
      }


  
      // Check if username already exists
      const existingUsers = await User_model.find({ UserName: { $in: [UserName] } });
  
      if (existingUsers.length > 0) {
        return res.json({
          status: false,
          message: "Username already exists",
          data: [],
        });
      }
  
    
      // Create new user
      const signinuser = new Sign_In({
        FullName,
        UserName,
        password,
        PhoneNo,
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
      console.error(error); // Log the error for debugging
      return res.json({
        status: false,
        message: "Internal error",
        data: [],
      });
    }
  }
  

  async getSignIn(req, res) {
    try {
      const result = await Sign_In.find({});

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



  async logoutUser(req, res) {


    try {
        const { userid } = req.body;
        
          const user_detail = await findOne({_id:userid})
           
           console.log("user_detail",user_detail)
         

           
           return

        const user_login = new user_logs({
            userid: EmailCheck[0]._id,
            admin_Id: EmailCheck[0].parent_id,
            login_status: "Panel off",
            role: EmailCheck[0].Role,
            system_ip: system_ip
        })
        await user_login.save();

        return res.send({ status: true, msg: "Logout Succesfully", data: [] })


    } catch (error) {

    }
}




}

module.exports = new Auth();
