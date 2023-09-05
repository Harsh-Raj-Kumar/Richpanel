const mongoose = require('mongoose');

const bill = new mongoose.Schema({
    email : {
        type: String,
        required: true, 
    }, 
    amount : {
        type: String,
        required: true,
    },
    plan : {
        type: String,
        required: true,
    },
    payment_id : {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Bill', bill);