"use strict"

const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')
const Role = require("./Role.model")


const employeepermission = Schema({
    employee_id :{
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        default: null
   },
   client_add: {
    type: Number,
    enum: [0, 1],
    default: 0
},
    Edit: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    trade_history: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
   open_position: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    Licence_Edit: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    pertrade_edit :{
        type: Number,
        enum: [0, 1],
        default: 0
    },
    perlot_edit :{
        type: Number,
        enum: [0, 1],
        default: 0
    },
    limit_edit :{
        type: Number,
        enum: [0, 1],
        default: 0
    },
    Balance_edit:{
        type: Number,
        enum: [0, 1],
        default: 0
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
const employee_permission = model('employeePermission', employeepermission);



module.exports = employee_permission;