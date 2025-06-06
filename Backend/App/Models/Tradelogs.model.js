const mongoose = require('mongoose');

const TradeLogsActivitySchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    admin_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        default: null
    },
    UserName: {
        type: String,
        default: null
    },
    login_status:{
         type: String,
         default: null
    },
   
  

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    
    _id: true,
});

const trade_logs = mongoose.model('trade_logs', TradeLogsActivitySchema);
module.exports = trade_logs;
