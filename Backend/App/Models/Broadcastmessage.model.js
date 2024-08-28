const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const broadcastmessage = new Schema({
  adminid: {
    type:Schema.Types.ObjectId,
    default: null
  },
  userid: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  Role:{
    type: String,
    default: null
  },
  title:{
    type: String,
    default: null
  },
  message: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

});

const broadcasting = mongoose.model('broadcastmessage', broadcastmessage);

module.exports = broadcasting;
