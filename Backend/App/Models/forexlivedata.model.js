const mongoose = require('mongoose');

const forexdata = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        
    },
     price: {
        type: Number,
        required: true,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    _id: true,
  });

const forexlivedata = mongoose.model('forexlivedata', forexdata);
module.exports = forexlivedata;
