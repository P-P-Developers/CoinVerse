"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const Symbol = db.Symbol;
const Userwatchlist = db.Userwatchlist;
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const User_model = db.user;
const Wallet_model = db.WalletRecharge;
const MarginRequired = db.MarginRequired
const BalanceStatement = db.BalanceStatement
const mainorder_model = db.mainorder_model;




class Users {
  


  //userWithdrawalanddeposite
  
  async userWithdrawalanddeposite(req, res) {
    try {
      const { userid, Balance, type } = req.body;

      const userdata = await User_model.findById({ _id: userid}).sort({ createdAt: -1 });;

      if (!userdata) {
        return res.json({ status: false, message: "User not found", data: [] });
      }
       

      const dollarPriceData = await MarginRequired.findOne({ adminid: userdata.parent_id }).select("dollarprice");
      if (!dollarPriceData) {
        return res.json({ status: false, message: "Dollar price data not found", data: [] });
      }
  

      const dollarcount = (Balance / dollarPriceData.dollarprice).toFixed(3);
      
      const paymentHistory = new PaymenetHistorySchema({
        userid: userid,
        adminid: userdata.parent_id,
        Balance: dollarcount,
        type: type,
        status: 0,
      });

      await paymentHistory.save();

      return res.json({
        status: true,
        message: "Request send",
        data: paymentHistory,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Error to Request send",
        data: [],
      });
    }
  }

  

  // get payment history 
  async getpaymenthistory(req, res) {
    try {
      const { userid } = req.body;
      const result = await PaymenetHistorySchema.find({ userid: userid }).sort({ createdAt: -1 });;

      if (!result) {
        return res.json({ status: false, message: "User not found", data: [] });
      }
      return res.json({
        status: true,
        message: "Find Successfully",
        data:result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  
  // get user

  async getUserDetail(req, res) {
    try {
      const { userid } = req.body;

      const result = await User_model.find({_id:userid, Role:"USER" }).select(
        "FullName Balance limit pertrade perlot turn_over_percentage brokerage UserName createdAt"
      ).sort({ createdAt: -1 });;

      if (!result || result.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "getting data",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

  


  //margin value for user

  async getmarginpriceforuser(req,res){
    try {
        const {userid} = req.body
        const result1 = await User_model.find({_id:userid}).select("parent_id").sort({ createdAt: -1 });
         
  
        const result = await MarginRequired.findOne({adminid:result1[0].parent_id}).select("crypto forex")
        


        if(!result){
            return res.json({status:false,message:"not found",data:[]})
        }
        return res.json({status:true,message:"getting successfully",data:result})

    } catch (error) {
        return res.json({status:false,message:"inernal error",data:[]})
    }
}



// get all statement 

 async getAllstatement(req,res){
  try {
      
      const {userid} = req.body
      const result = await BalanceStatement.find({userid:userid})
       
      
       
      if(!result){
        return res.json({status:false,message : "user not found",data:[]})
      }

      return res.json({status:true,message : "user found",data:result})

    
  } catch (error) {
    return res.json({status:false, message : "internal error",data:[]})
  }

 }


// async getAllstatement(req, res) {
//   try {
//     const { userid } = req.body;
//     const result = await BalanceStatement.aggregate([
//       { $match: { userid: userid } },
//       { 
//         $lookup: {
//           from: 'orders', 
//           localField: 'orderid',
//           foreignField: '_id', 
//           as: 'orderDetails'
//         }
//       }
//     ]);

//     if (!result.length) {
//       return res.json({ status: false, message: "User not found", data: [] });
//     }

//     return res.json({ status: true, message: "User found", data: result });
//   } catch (error) {
//     return res.json({ status: false, message: "Internal error", data: [] });
//   }
// }




 // get all orderposition of today 
 



 async getuserorderdata(req, res) {
  try {
      const { userid, symbol } = req.body;

      // Get current date at midnight
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Get next day at midnight
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const result = await mainorder_model.find({
          userid: userid,
          symbol: symbol,
          createdAt: {
              $gte: startOfDay,
              $lt: endOfDay
          }
      });

      if (!result || result.length === 0) {
          return res.json({
              status: false,
              message: "Data not found",
              data: []
          });
      }

      return res.json({
          status: true,
          message: "Data found",
          data: result
      });

  } catch (error) {
      return res.json({
          status: false,
          message: "Internal error",
          data: []
      });
  }
}






}

module.exports = new Users();
