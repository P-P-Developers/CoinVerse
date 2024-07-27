"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const totalLicense = db.totalLicense;
const PaymenetHistorySchema = db.PaymenetHistorySchema;
const MarginRequired = db.MarginRequired
const Symbol = db.Symbol

class Admin {


  async AddUser(req, res) {
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
        Balance,
        Licence,
        pertrade,
        perlot,
        turn_over_percentage,
        brokerage,
        limit,
      } = req.body;

      if (!FullName || !UserName || !Email || !PhoneNo || !password || !Role) {
        return res.json({ status: false, message: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await User_model.findOne({
        $or: [{ UserName }, { Email }, { PhoneNo }],
      });


      if (existingUser) {
        if (existingUser.UserName === UserName) {
          return res.send({
            status: false,
            message: "Username already exists",
            data: [],
          });
        }

        if (existingUser.Email === Email) {
          return res.send({
            status: false,
            message: "Email already exists",
            data: [],
          });
        }

        if (existingUser.PhoneNo === PhoneNo) {
          return res.send({
            status: false,
            message: "Phone Number already exists",
            data: [],
          });
        }
      }

      // Hash password
      var rand_password = Math.round(password);
      const salt = await bcrypt.genSalt(10);
      var hashedPassword = await bcrypt.hash(rand_password.toString(), salt);


    /// dollar price
      const dollarPriceData = await MarginRequired.findOne({adminid:parent_id}).select("dollarprice");
      const dollarcount = (Balance / dollarPriceData.dollarprice).toFixed(3);
      

      // Create new user
      const newUser = new User_model({
        FullName,
        UserName,
        Email,
        PhoneNo,
        parent_id,
        parent_role,
        Balance:dollarcount,
        Otp,
        Role,
        Licence,
        pertrade,
        perlot,
        turn_over_percentage,
        brokerage,
        limit,
        password: hashedPassword,
      });

      await newUser.save();



      let userWallet = new Wallet_model({
        user_Id: newUser._id,
        Balance: dollarcount,
        parent_Id: parent_id,
      });

       
      await userWallet.save();

      let licence = new totalLicense({
        user_Id: newUser._id,
        Licence: Licence,
        parent_Id: parent_id,
      });

      await licence.save();

      return res.json({
        status: true,
        message: "Users added successfully",
        data: newUser,
      });
    } catch (error) {
      res.json({ status: false, message: "Failed to add User", data: [] });
    }
  }

  // update Licence

  async updateLicence(req, res) {
    try {
      const { id, Licence, parent_Id } = req.body;

      const userdata = await User_model.findOne({ _id: id });
      if (!userdata) {
        return res.json({
          status: false,
          message: "Licence not found",
          data: [],
        });
      }

      const newLicence = Number(userdata.Licence || 0) + Number(Licence);
      const result1 = await User_model.updateOne(
        { _id: userdata._id },
        { $set: { Licence: newLicence } }
      );

      const result = new totalLicense({
        user_Id: userdata._id,
        Licence: Licence,
        parent_Id: parent_Id,
      });
      await result.save();

      return res.json({
        status: true,
        message: "Licence is updated",
        data: result,
      });
    } catch (error) {
      return res.json({ status: false, message: "Internal error", data: [] });
    }
  }

async updateUser(req, res) {
  try {
    const { id, perlot, pertrade, ...rest } = req.body;

    const values = [perlot, pertrade];
    const nonZeroValues = values.filter(value => value !== undefined && value !== 0);

    if (nonZeroValues.length > 1) {
      return res.status(400).send({
        status: false,
        msg: "Only one of perlot or pertrade can have a non-zero value",
      });
    }

    // Initialize dataToUpdate with default zero values
    let dataToUpdate = {
      perlot: 0,
      pertrade: 0,
      ...rest,
    };

    // Assign non-zero values accordingly
    if (perlot !== undefined && perlot !== 0) {
      dataToUpdate.perlot = perlot;
    } else if (pertrade !== undefined && pertrade !== 0) {
      dataToUpdate.pertrade = pertrade;
    }

    const filter = { _id: id };
    const updateOperation = { $set: dataToUpdate };

    const updatedUser = await User_model.findOneAndUpdate(filter, updateOperation, {
      new: true,
      upsert: true,
    });

    if (!updatedUser) {
      return res.status(404).send({
        status: false,
        msg: "Data not updated",
        data: [],
      });
    }

    return res.send({
      status: true,
      msg: "Data updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Internal error:", error);
    return res.status(500).send({
      status: false,
      msg: "Internal server error",
    });
  }
}


  // user by id

  async DeleteUser(req, res) {
    try {
      const { id } = req.body;
      const result = await User_model.findOneAndDelete({ _id: id });

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "User not found", data: [] });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", data: [] });
    }
  }

  // Employee updare

  async Update_Employe(req, res) {
    try {
      const data = req.body;
      const id = req.body.id;

      const filter = { _id: id };
      const updateOperation = { $set: data };

      const result = await User_model.updateOne(filter, updateOperation);

      if (result.nModified === 0) {
        return res.json({
          status: false,
          message: "Data not updated",
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

  // delete Employee User

  async Delete_Employee(req, res) {
    try {
      const { id } = req.body;
      const result = await User_model.findOneAndDelete({
        _id: id,
        Role: "EMPLOYE",
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

  // get paymentstatus

  async getuserpaymentstatus(req, res) {
    try {
      const { adminid } = req.body;

      const walletData = await PaymenetHistorySchema.aggregate([
        {
          $match: {
            adminid: adminid,
          },
        },
        {
          $addFields: {
            userid: { $toObjectId: "$userid" },
           
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userid",
            foreignField: "_id",
            as: "userName",
          },
        },
        {
          $unwind: "$userName",
        },
        {
          $project: {
            UserName: "$userName.UserName",
            FullName: "$userName.FullName",
            adminid: 1,
            type: 1,
            status: 1,
            createdAt: 1,
            _id: 1,
            userid: 1,
            Balance: 1,
          },
        },
        {
          $sort: {
            createdAt: -1, 
          },
        },
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
      return res.json({
        status: false,
        message: "Internal server error",
        data: [],
      });
    }
  }




// update by status 

async UpdateStatus(req, res) {
  try {
    const { id, status } = req.body;

    const filter = { _id: new ObjectId(id) };
    const paymentHistoryFind = await PaymenetHistorySchema.findOne(filter);
    
    if (!paymentHistoryFind) {
      return res.json({
        status: false,
        message: "Payment history not found",
      });
    }

    const findUser = await User_model.findOne({
      _id: new ObjectId(paymentHistoryFind.userid),
    }).select("Balance");

    if (!findUser) {
      return res.json({
        status: false,
        message: "User not found",
      });
    }

    if (status == 1) {
      if (paymentHistoryFind.type == 0) {
        if (paymentHistoryFind.Balance > findUser.Balance) {
          return res.json({
            status: false,
            message: "Insufficient balance",
          });
        }

        findUser.Balance -= paymentHistoryFind.Balance;
        await findUser.save();

        paymentHistoryFind.status = status;
        await paymentHistoryFind.save();

        const walletUpdateResult = new Wallet_model({
          user_Id: findUser._id,
          Balance: paymentHistoryFind.Balance,
          parent_Id: paymentHistoryFind.adminid,
          Type: "DEBIT",
        });

        await walletUpdateResult.save();
        return res.json({
          status: true,
          message: "Withdrawal request Accepted successfully",
        });

      } else if (paymentHistoryFind.type == 1) {
        findUser.Balance += paymentHistoryFind.Balance;
        await findUser.save();

        paymentHistoryFind.status = status;
        await paymentHistoryFind.save();

        const walletUpdateResult = new Wallet_model({
          user_Id: findUser._id,
          Balance: paymentHistoryFind.Balance,
          parent_Id: paymentHistoryFind.adminid,
          Type: "CREDIT",
        });

        await walletUpdateResult.save();
        return res.json({
          status: true,
          message: "Deposit request Accepted successfully",
        });

      } else {
        return res.json({
          status: false,
          message: "Invalid type provided",
        });
      }

    } else if (status == 2) {
      paymentHistoryFind.status = status;
      await paymentHistoryFind.save();
      return res.json({
        status: true,
        message: "Order is rejected",
      });

    } else {
      return res.json({
        status: false,
        message: "Invalid status provided",
      });
    }

  } catch (error) {
    return res.json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}




async  getsymbolholdoff(req,res){
   try {
       const result = await Symbol.find({})
       if(!result){
           return res.json({status:false, message:"symbol not found" ,data:[]})
       }
       return res.json({status: true, message:"symbol  found" , data: result })

   } catch (error) {

    return res.json({status: false, message:"internal error " , data: [] })

   }

}


// async updatesymbolholoff(req,res){
//     try {
//          const {symbol ,status} = 
//     } catch (error) {
      
//     }
// }


async updatesymbolholoff(req, res) {
  try {
      const { symbol , status} = req.body;
      
      if (!symbol) {
          return res.json({stats:false, message: "symbol ID is required." , data:[] });
      }

      const result = await Symbol.updateOne(
          { symbol: symbol }, 
          { status },
          
      );

      return res.json({
          status: true,
          message:"Updated",
          data: result
      });

  } catch (error) {
      console.error(error);
      return res.json({ message: "An error occurred while updating margin." });
  }
}




}

module.exports = new Admin();
