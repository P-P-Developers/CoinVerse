"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const jwt = require("jsonwebtoken");
const User_model = db.user;
const Sign_In = db.Sign_In;

class Auth {


  async login(req, res) {
    try {
      const { UserName, password } = req.body;

      const EmailCheck = await User_model.findOne({ UserName:UserName });

      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

        if (EmailCheck.ActiveStatus !== "1") {
          return res.send({ status: false, msg: "Account is not active", data: [] });
        }
 
      const validPassword = await bcrypt.compare(password, EmailCheck.password);

      if (!validPassword) {
        return res.send({ status: false, msg: "Password Not Match", data: [] });
      }

      // JWT TOKEN CREATE
      var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
        expiresIn: 36000,
      });

      return res.send({
        status: true,
        msg: "Login Successfully",
        data: { token: token, Role: EmailCheck.Role, user_id: EmailCheck._id },
      });
    } catch (error) {
      res.send({ status: false, msg: "Server Side error", data: error });
    }   
  }



  async SignIn(req, res) {
    try {
        const { FullName, UserName, Email, password } = req.body;


        if (!FullName || !UserName || !Email || !password) {
            return res.json({ status: false, message: "Missing required fields", data: [] });
        }

        // Hash the password
        var rand_password = Math.round(password);
        const salt = await bcrypt.genSalt(10);
        var hashedPassword = await bcrypt.hash(rand_password.toString(), salt);

    
        const signinuser = new Sign_In({
            FullName,
            UserName,
            Email,
            password: hashedPassword,
        });

        const result = await signinuser.save();

        if (!result) {
            return res.json({ status: false, message: "Unable to sign in", data: [] });
        }

        return res.json({
            status: true,
            message: "Sign in successfully",
            data: [],
        });

    } catch (error) {
       
        return res.json({
            status: false,
            message: "Internal error",
            data: [],
        });
    }
}




}

module.exports = new Auth();
