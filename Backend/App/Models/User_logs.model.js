const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
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
   
    role: {
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

const user_logs = mongoose.model('user_logs', userActivitySchema);
module.exports = user_logs;
