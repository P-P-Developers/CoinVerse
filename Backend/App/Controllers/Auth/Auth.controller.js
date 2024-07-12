"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require('../../Models');
const jwt = require("jsonwebtoken");
const User_model = db.user;



class Auth {

    async login(req, res) {
        try {
            const { Email, password } = req.body;
    
            const EmailCheck = await User_model.findOne({Email: Email});

            if (!EmailCheck) {
                return res.send({ status: false, msg:'User Not exists', data: [] });
            }
    
            const validPassword = await bcrypt.compare(password, EmailCheck.password);

            if (!validPassword) {
                return res.send({ status: false, msg: 'Password Not Match', data: [] });
            }
    

            // JWT TOKEN CREATE
            var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
                expiresIn: 36000 
            });
    
            return res.send({ status: true, msg: "Login Successfully", data: { token } });


        } catch (error) {

            console.error("Error during login:", error);
            res.send({ status: false, msg: "Server Side error", data: error });

        }
    }   

}




module.exports = new Auth();