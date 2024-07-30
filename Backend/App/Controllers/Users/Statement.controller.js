"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const { findOne } = require("../../Models/Role.model");
const Symbol = db.Symbol;
const Userwatchlist = db.Userwatchlist;
const Order = db.Order;
const WalletRecharge = db.WalletRecharge;
const User_model = db.user;
const mainorder_model = db.mainorder_model;
const Statement = db.Statement



class statement{

  
    async statement(req, res) {

        try {
            const data = await Order.find({ userid: req.body.userid }).sort({ _id: -1 });
    
            const result = data.map((item) => ({
                Symbol: item.symbol,
                price: item.price,
                type: item.type,
                qty: item.qty,
                lot: item.lot,
                brokerage: item.brokerage,
                requiredFund: item.requiredFund,
                createdAt: item.createdAt,
                status:item.status
            }));


           if(!result){
            res.json({ status:false, message: "not found", data: [] });

           }

            res.json({ status: true, message: "success", data: result });

        } catch (err) {

            res.json({ status: false, message: "internal error", data: [] });
        }
    }
    
   



}

module.exports = new statement();