"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const Symbol = db.Symbol;
const Userwatchlist = db.Userwatchlist
const Order = db.Order
const WalletRecharge = db.WalletRecharge
const User_model = db.user;




class Placeorder{
   
      async placeorder(req,res){
        try {

            const entry_exit =  req.body.entry_exit; 
            if(entry_exit == "ENTRY"){
             await EntryTrade(req,res)
            }
            else if(entry_exit == "EXIT"){
             await ExitTrade(req,res)
            }else{
                return res.json({status:false,msg:"Invalid request"}) 
            }

          } catch (error) {
            
            res.json({ message: 'Server error', error: error.message });
          }
      }
    
}



   // for entry trade 

   const EntryTrade = async (req, res) => {
    const { userid, symbol, price, lot, qty } = req.body;
  
    try{
     
      const checkadmin = await User_model.findOne({ _id:userid ,Role:"USER"});

      if (!checkadmin) {
        return res.json({status: false, message: 'User not found',data :[]});
      }

      const adminId = checkadmin.parent_id;
      
      let order = await Order.findOne({ userid, symbol });
  
      if (order) {
        order.price = price;
        order.lot = lot;
        order.qty = qty;
        order.adminid = adminId;
    
        

        await order.save();
  
        res.json({ status:true, message: 'Order placed successfully', order });

      } else {
       
        order = new Order({ userid, symbol, price, lot, qty, adminid });
  
        await order.save();
  
        res.json({status: true, message:'Order placed successfully', order });
      }
       
      

    } catch (error) {
      console.error(error);
      res.json({ status:false,message: 'Server error',data:[] });
    }
  };
  


  // for exit trade 

const ExitTrade = async (req, res) => {
    const { userid, symbol, price, lot, qty } = req.body;

    const checkadmin = await User_model.findOne({ _id:userid ,Role:"USER"});

    if (!checkadmin) {
      return res.json({ message: 'User not found'});
    }

    const adminId = checkadmin.parent_id;
  
    let order = await Order.findOne({ userid, symbol });
  
    if (order) {
      order.status = "closed";
      order.exitPrice = price;
      order.lot = lot;
      order.qty = qty;
      order.adminid = adminId;
      await order.save();
  
      res.json({ status: true, message: 'Order exited successfully', order });

    } else {

      res.json({ status: false, msg: "No active order found to exit",data:[]});
    }
  };



module.exports = new Placeorder()
