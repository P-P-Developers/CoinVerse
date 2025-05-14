"use strict"

const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')
const Role = require("./Role.model")

const userModel = Schema({
    FullName: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    UserName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: null,
        lowercase: true,
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: null,
        lowercase: true,
    },
    PhoneNo: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 10,
        unique: true,
        default: null
    },
    password: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    pin: {
        type: String, 
        default: null
        
    },

    pin_status: {
        type: Boolean, // Indicates if pin has been set
        default: false
    },
    Otp: {
        type: String,
        trim: true,
        default: null
    },
    employee_id: {
        type: String,
        trim: true,
        default: null
    },
    Create_Date: {
        type: Date,
        default: Date.now
    },
    Role: {
        type: String,
        required: true
    },
    Is_Active: {
        type: String,
        enum: ['1', '0'],
        default: '1'
    },
    ActiveStatus: {
        type: String,
        enum: ['1', '0'],
        default: '0'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parent_id: {
        type: String,
        required: true,
    },
    Balance: {
        type: Number,
        default: null
    },
    Licence: {
        type: Number,
        default: null
    },

    Start_Date: {
        type: Date,
        default: null
    },
    End_Date: {
        type: Date,
        default: null
    },
    parent_role: {
        type: String,
        required: true,

    },
    pertrade: {
        type: Number,
        defaultValue: null
    },
    perlot: {
        type: Number,
        default: null
    },
    transactionwise: {
        type: Number,
        default: null
    },
    
    limit: {
        type: Number,
        default: null
    },
    ProfitMargin: {
        type: Number,
        default: null
    },
    ProfitBalance: {
        type: Number,
        default: null
    },

    ReferralCode: {
        type: String,
        trim: true,
        default: null,
    },

    ReferredBy: {
        type: String, // Stores the referral code of the referrer
        trim: true,
        default: null,
    },
    DeviceToken: {
        type: String,
        trim: true,
        default: null
    },
    Refer_Price: {
        type: String,
        default: null
    },
    Range1: {
        type: Number,
        default: null
    },
    Range2: {
        type: Number,
        default: null
    },
    Range3: {
        type: Number,
        default: null
    },
    Range4: {
        type: Number,
        default: null
    },
    
    FixedPerClient: {
        type: Boolean,
        default: false
    },
    FundAdd: {
        type: Boolean,
        default: false
    },
    EveryTransaction: {
        type: Boolean,
        default: false
    },
    AddClientBonus: {
        type: Number,
        default: null
    },
    FundLessThan100: {
        type: Number,
        default: null
    },
    FundLessThan500: {
        type: Number,
        default: null
    },
    FundLessThan1000: {
        type: Number,
        default: null
    },
    FundGreaterThan1000: {
        type: Number,
        default: null
    },
    FixedTransactionPercent: {
        type: Number,
        default: null
    },
    NetTransactionPercent: {
        type: Boolean,
        default: false
    },
    NetTransaction: {
        type: Number,
        default: null
    },

},
    {
        timestamps: true
    },

)
const User_model = model('USER', userModel);

module.exports = User_model;
