"use strict"

const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')
const Role = require("./Role.model")



// Employee Financial Information Collection
const SignInUser = Schema({
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
