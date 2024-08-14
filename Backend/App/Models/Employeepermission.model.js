"use strict"

const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')
const Role = require("./Role.model")


const employeepermission = Schema({
    Edit: {
        type: String,
        enum: ['1', '0'],
        default: '0'
    },
    trade_history: {
        type: String,
        enum: ['1', '0'],
        default: '0'
    },
   open_position: {
        type: String,
        enum: ['1', '0'],
        default: '0'
    },
    Licence_Edit: {
        type: String,
        enum: ['1', '0'],
        default: '0'
    },
    pertrade_edit :{
        type: String,
        enum: ['1', '0'],
        default: '0'
    },
    perlot_edit :{
        type: String,
        enum: ['1', '0'],
        default: '0'
    },
    limit_edit :{
        type: String,
        enum: ['1', '0'],
        default: '0'
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