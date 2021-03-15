const mongoose = require('mongoose');

const Hotel = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    address: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Hotel', Hotel);