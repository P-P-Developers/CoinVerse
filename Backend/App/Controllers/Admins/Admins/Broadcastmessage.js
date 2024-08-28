"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const broadcasting = db.broadcasting


class broadcastingmessage{

    async broadcastmessage(req, res) {
        try {
            const { message, title, adminid, Role } = req.body;
    
            const newBroadcast = new broadcasting({
                message,
                title,
                adminid,
                Role,
                createdAt: new Date(),
            });
    
            const result = await newBroadcast.save();

           return res.status(200).json({ success: true,message:"Mesaage send" , data: result });
    
        } catch (error) {
         
            return res.json({ success: false, message: 'Failed to save broadcast message' , data: [] });
        }
    }
    

}



module.exports = new broadcastingmessage();