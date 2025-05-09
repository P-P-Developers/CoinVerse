"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const MarginRequired = db.MarginRequired



class MarginReq {
    
    async marginupdate(req, res) {
        try {
            const { forex, crypto, dollarprice , adminid } = req.body;
            
            if (!adminid) {
                return res.json({ message: "Admin ID is required." });
            }

            const adminObjectId = new ObjectId(adminid);
            
            const result = await MarginRequired.updateOne(
                { adminid: adminObjectId }, 
                { forex, crypto ,dollarprice},
                { 
                    upsert: true 
                }
            );
    
            return res.json({
                status: true,
                message: result ? "Margin updated successfully." : "Margin created successfully.",
                data: result
            });
    
        } catch (error) {
      
            return res.json({ message: "An error occurred while updating margin." });
        }
    }

     
    async getmarginprice(req,res){
        try {
            const {id} = req.body
            const result = await MarginRequired.findOne({adminid:id})

            if(!result){
                return res.json({status:false,message:"not found",data:[]})
            }
            return res.json({status:true,message:"getting successfully",data:result})

        } catch (error) {
            return res.json({status:false,message:"inernal error",data:[]})
        }
    }

   
    async getmarginpriceforuser(req,res){
        try {
            const {id} = req.body
            const result = await MarginRequired.findOne({adminid:id})

            if(!result){
                return res.json({status:false,message:"not found",data:[]})
            }
            return res.json({status:true,message:"getting successfully",data:result})

        } catch (error) {
            return res.json({status:false,message:"inernal error",data:[]})
        }
    }



}

module.exports = new MarginReq();
