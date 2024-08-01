"use strict"

const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')
const Role = require("./Role.model")


const SignInUser = Schema({
    FullName: {
        type: String,
        trim: true,
        default: null
    },
    UserName: {
        type: String,
        required: true,
        default: null
    },
    PhoneNo: {
        type: String,
        required: true,
        min: 10,
        max: 10,
        default: null
    },
    password:{
        type:String,
        required: true,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
},
    {
        timestamps: true
    },

)
const Sign_In = model('SignInUser', SignInUser);



module.exports = Sign_In;
