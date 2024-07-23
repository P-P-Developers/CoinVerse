"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const Symbol = db.Symbol;
const Userwatchlist = db.Userwatchlist;
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const User_model = db.user;

class Users {


  async userWithdrawalanddeposite(req, res) {
    try {
      const { id, Balance ,type } = req.body;

    const userdata = await User_model.findById({ _id: id});
    
      if (!userdata) {
        return res.json({ status: false, message: "User not found", data: [] });
      }

      const paymentHistory = new PaymenetHistorySchema({
        userid: id,
        adminid: userdata.parent_id,
        Balance: Balance,
        type: type,
        status: 0,
      });

      await paymentHistory.save();

      return res.json({status:true, message: "Request send" , data: paymentHistory });

    } catch (error) {

      return res.json({status:false, message: "Error to Request send" , data:[] });
    }
  }

  

  async getpaymenthistory(req,res){
      try {
            
         const { id } = req.body
         const result = await PaymenetHistorySchema.find({ userid:id })

         if(!result){
            return res.json({status: false,message:"User not found",data:[]})
         }
         return res.json({status:true,message:"Find Successfully",data:result})


      } catch (error) {
        return res.json({status: false,message:"Server error",data:[]})
      }
  }



}

module.exports = new Users();
