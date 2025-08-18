const mongoose = require('mongoose');

const tradeSwitchlog = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    admin_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        default: null
    },
    Trade_Id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    Symbol: {
        type: String,
        default: null
    },
    message: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
});

const tradeSwitchlogs = mongoose.model('tradeSwitchlogs', tradeSwitchlog);
module.exports = tradeSwitchlogs;
