"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const { findOne } = require("../../../Models/Role.model");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const totalLicense = db.totalLicense
const MarginRequired = db.MarginRequired
const BalanceStatement = db.BalanceStatement;
const employee_permission = db.employee_permission;



class Superadmin {


  async AddAdmin(req, res) {
    try {
      const {
        FullName,
        UserName,
        Email,
        PhoneNo,
        parent_id,
        parent_role,
        password,
        Otp,
        Role,
        Licence,
        pertrade,
        perlot,
        turn_over_percentage,
        brokerage,
        limit,
        Employee_permission,
      } = req.body;
  
      if (!FullName || !UserName || !Email || !PhoneNo || !password || !Role) {
        return res.status(400).json({ status: false, message: "Missing required fields" });
      }
  
    
      const existingUser = await User_model.findOne({
        $or: [{ UserName }, { Email }, { PhoneNo }],
      });
  

      if (existingUser) {
        if (existingUser.UserName === UserName) {
          return res.json({ status: false, message: "Username already exists" });
        }
  
        if (existingUser.Email === Email) {
          return res.json({ status: false, message: "Email already exists" });
        }
  
        if (existingUser.PhoneNo === PhoneNo) {
          return res.json({ status: false, message: "Phone Number already exists" });
        }
      }
  

         // Current date as start date
      const startDate = new Date();
      let endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + Number(Licence));

      if (endDate.getDate() < startDate.getDate()) {
        endDate.setDate(0);
      }
       
      // // Fetch dollar price data
      // const dollarPriceData = await MarginRequired.findOne({adminid:parent_id }).select("dollarprice");
      // if (!dollarPriceData) {
      //   return res.json({ status: false, message: "Dollar price data not found" });
      // }
  
      // // Calculate dollar count
      // const dollarcount = (Balance / dollarPriceData.dollarprice).toFixed(3);
   

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.toString(), salt);
  
     const activeStatus = parent_role === "EMPLOYE" ? 0 : 1;

      // Create new user
      const newUser = new User_model({
        FullName,
        UserName,
        Email,
        PhoneNo,
        parent_id,
        parent_role,
        Otp:password,
        Role,
        pertrade,
        perlot,
        turn_over_percentage,
        brokerage,
        limit,
        Licence,
        password: hashedPassword,
        Start_Date: startDate,
        End_Date: endDate,
        ActiveStatus: activeStatus,
      });
  
      await newUser.save();
  
      // // Create user wallet
      // const userWallet = new Wallet_model({
      //   user_Id: newUser._id,
      //   Balance: dollarcount,
      //   parent_Id: parent_id
      // });
      // await userWallet.save();
  
      let licence = new totalLicense({
        user_Id: newUser._id,
        Licence: Licence,
        parent_Id: parent_id,
        Start_Date: startDate,
        End_Date: endDate,
      });

      await licence.save();

  if (Employee_permission) {
    const {
      Edit,
      trade_history,
      open_position,
      Licence_Edit,
      pertrade_edit,
      perlot_edit,
      limit_edit,
      Balance_edit
    } = Employee_permission;

    const newPermission = new employee_permission({
      employee_id: newUser._id,
      Edit,
      trade_history,
      open_position,
      Licence_Edit,
      pertrade_edit,
      perlot_edit,
      limit_edit,
      Balance_edit
    });

   
    await newPermission.save();
  }


      return res.json({
        status: true,
        message: "User added successfully",
        data: newUser,
      });
    } catch (error) {
      console.error(error);
      return res.json({ status: false, message: "Failed to add user", data: [] });
    }
  }


  
  async walletRecharge(req, res) {
    try {
      const { id, Balance, parent_Id, Type } = req.body;
  
      const dollarPriceData = await MarginRequired.findOne({adminid:parent_Id}).select("dollarprice");
      if (!dollarPriceData) {
        return res.json({
          status: false,
          message: "Dollar price data not found",
          data: [],
        });
      }
      

      const dollarcount = (Balance/dollarPriceData.dollarprice).toFixed(3);
  
  
      const userdata = await User_model.findOne({ _id: id });
      if (!userdata) {
        return res.json({
          status: false,
          message: "Wallet not found",
          data: [],
        });
      }
  
      let newBalance;
      if (Type === "CREDIT") {
        newBalance = Number(userdata.Balance || 0) + Number(dollarcount);
      } else if (Type === "DEBIT") {
        newBalance = Number(userdata.Balance || 0) - Number(dollarcount);
        if (newBalance < 0) {
          return res.json({
            status: false,
            message: "Insufficient balance",
            data: [],
          });
        }
      } else {
        return res.json({
          status: false,
          message: "Invalid transaction type",
          data: [],
        });
      }
  
    
      await User_model.updateOne(
        { _id: userdata._id },
        { $set: { Balance: newBalance } }
      );
   
  
 
      const result = new Wallet_model({
        user_Id: userdata._id,
        Balance: dollarcount,  
        parent_Id: parent_Id,
        Type: Type,
      });
  
      await result.save();
    

      let newstatement = new BalanceStatement({
        userid: userdata._id,
        Amount :dollarcount,
        parent_Id: parent_Id,
        type:"CREDIT",
        message:"Balance Credit"
      });
      await newstatement.save();
  

      return res.json({
        status: true,
        message: "Balance is updated",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }
  


  // get all admin detail

  // async getAdminDetail(req, res) {
  //   try {
  //     const { id } = req.body;
    
  //     const result = await User_model.find({ parent_id:id});
       
  //     const adminIds = result.map(result => result._id);

  //     const permissions = await employee_permission.find({ employee_id: { $in: adminIds } });
    
  //     if (!result || result.length === 0) {
  //       return res.json({ status: false, message: "Data not found", data: [] });
  //     }

  //     return res.json({
  //       status: true,
  //       message: "getting data",
  //       data: result,permissions,
  //     });
  //   } catch (error) {
  //     return res.json({ status: false, message: "Internal error", data: [] });
  //   }
  // }

  async getAdminDetail(req, res) {
    try {
        const { id } = req.body;
        const result = await User_model.find({ parent_id: id });
        
        const adminIds = result.map(user => user._id);
        const permissions = await employee_permission.find({ employee_id: { $in: adminIds } });

        if (!result || result.length === 0) {
            return res.json({ status: false, message: "Data not found", data: [] });
        }

        const combinedData = result.map(user => {
            const userPermissions = permissions.filter(permission => permission.employee_id.equals(user._id));

            return {
                ...user.toObject(),
                permissions: userPermissions
            };
        });

        return res.json({
            status: true,
            message: "Getting data",
            data: combinedData
        });
    } catch (error) {
        return res.json({ status: false, message: "Internal error", data: [] });
    }
}

  

  
  // update status
  
  async UpdateActiveStatusAdmin(req, res) {
    try {
      const { id, user_active_status } = req.body;
      const get_user = await User_model.find({ _id: id });
      if (get_user.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }

      const filter = { _id: id };
      const updateOperation = { $set: { ActiveStatus: user_active_status } };
      const result = await User_model.updateOne(filter, updateOperation);

      if (result) {
        // STATUS UPDATE SUCCESSFULLY
        var status_msg = user_active_status == "0" ? "DeActivate" : "Activate";

        res.send({
          status: true,
          msg: "Update Successfully",
          data: result,
        });
      }
    } catch (error) {
      console.log("Error trading status Error-", error);
    }
  }





  // admin history

  async getadminhistory(req, res) {
    try {
      const walletData = await Wallet_model.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_Id",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $project: {
            UserName: "$userData.UserName",
            Balance: 1,
            createdAt: 1,
            parent_Id:1,
            Type:1
          },
        },
        {
          $sort:{
            createdAt : -1 
          }
        }
      ]);

      if (!walletData || walletData.length === 0) {
        return res.json({ status: false, message: "Data not found", data: [] });
      }

      return res.json({
        status: true,
        message: "Successfully fetched data",
        data: walletData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error", data: [] });
    }
  }


// update admin 
  async Update_Admin(req, res) {
    try {
      const data = req.body;
      const id = req.body.id;

      const filter = { _id: id ,Role:"ADMIN"};
      const updateOperation = { $set: data };

      const result = await User_model.updateOne(filter, updateOperation);

      if (result.nModified === 0) {
        return res.json({
          status: false,
          message: "Data not Updated",
          data: [],
        });
      }
      return res.json({ status: true, message: "Data updated", data: result });
    } catch (error) {
      return res.json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
   


  // deleted admin 

  async Delete_Admin(req, res) {
    try {
      const { id } = req.body;
      const result = await User_model.findOneAndDelete({
        _id: id,
        Role:"ADMIN",
      });

      if (!result) {
        return res.json({
          success: false,
          message: "User not found",
          data: [],
        });
      }

      return res.json({
        success: true,
        message: "User deleted successfully",
        data: result,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: "Internal server error",
        data: [],
      });
    }
  }

   
  async SuperadminGetDashboardData(req, res) {
    try {
      const { parent_id } = req.body; 
      const counts = await User_model.aggregate([
        {
          $facet: {
            TotalAdminCount: [
              { $match: { Role: "ADMIN", parent_id: parent_id } },
              { $count: "count" },
            ],
            TotalActiveAdminCount: [
              {
                $match: {
                  Role: "ADMIN",
                  ActiveStatus: "1",
                  parent_id: parent_id,
                  $or: [{ End_Date: { $gte: new Date() } }, { End_Date: null }],
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            TotalAdminCount: { $ifNull: [{ $arrayElemAt: ["$TotalAdminCount.count", 0] }, 0] },
            TotalActiveAdminCount: { $ifNull: [{ $arrayElemAt: ["$TotalActiveAdminCount.count", 0] }, 0] },
          },
        },
      ]);
  
      const {
        TotalAdminCount,
        TotalActiveAdminCount,
      } = counts[0];
  
      var Count = {
        TotalAdminCount: TotalAdminCount,
        TotalActiveAdminCount: TotalActiveAdminCount,
        TotalInActiveAdminCount: TotalAdminCount - TotalActiveAdminCount,
      };
  
      // DATA GET SUCCESSFULLY
      res.send({
        status: true,
        msg: "Get Dashboard Data",
        data: Count,
      });
    } catch (error) {
      console.log("Error getting Dashboard Data:", error);
      res.status(500).send({
        status: false,
        msg: "Internal Server Error",
      });
    }
  }


  async getAllclent(req,res){
    try {
      const {userid} = req.body 
      const result = await User_model.findOne({ _id: userid})
       
      if(!result){
        return res.json({status:false,message:"not found",data:[]})
      }

      return res.json({status:true,message:"user found",data:result})

      
    } catch (error) {
      return res.json({status:false,message:"internal error",data:[]})
      
    }
  }

  

}

module.exports = new Superadmin();
