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
        default: null
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: null
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
    password:{
        type:String,
        required: true,
        trim: true,
        default: null
    },
    Otp: {
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
        default: '1'
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
        type:Number,
        default: null
    },
    Licence: {
        type:Number,
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
    pertrade :{
        type: Number,
        defaultValue : null
    },
    perlot :{
        type: Number,
        default : null
    },
    turn_over_percentage :{
        type: Number,
        default : null
    },
    brokerage :{
        type: Number,
        default : null
    },
    limit :{
        type: Number,
        default : null
    }
    
},
    {
        timestamps: true
    },

)
const User_model = model('USER', userModel);



module.exports = User_model;
