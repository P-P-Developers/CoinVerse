const mongoose = require('mongoose');

const WalletRecharge = new mongoose.Schema({
 
    
    parent_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    Balance: {
        type: Number,
        required: true
    },
    Name:{
        type:String,
        
    },
    multiplelimit: {
        type: String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    Type:{
        type:String,
       
    }
   
},{
    _id: true,
  });

const WalletRecharges = mongoose.model('WalletRecharges',WalletRecharge);
module.exports = WalletRecharges;
