const mongoose = require('mongoose');

const WalletRecharge = new mongoose.Schema({
 
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    Balance: {
        type: String,
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
   
},{
    _id: true,
  });

const WalletRecharges = mongoose.model('WalletRecharges',WalletRecharge);
module.exports = WalletRecharges;
