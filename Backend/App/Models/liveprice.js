const mongoose = require('mongoose');

const live_price = new mongoose.Schema({})
const live_priceModal = mongoose.model('live_price',live_price);
module.exports = live_priceModal;