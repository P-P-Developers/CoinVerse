const mongoose = require('mongoose');

const Licence = new mongoose.Schema({
 
    parent_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    Licence: {
        type: Number,
        required: true
    },
    multiplelimit: {
        type: Number,
        
    },
    Start_Date: {
        type: Date,
        default: null
    },
    End_Date: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
   
},{
    _id: true,
  });

const totalLicense = mongoose.model('Licence',Licence);
module.exports = totalLicense;
