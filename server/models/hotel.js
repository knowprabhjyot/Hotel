const mongoose = require('mongoose');

const Hotel = mongoose.model('Hotel', {
    name: {
        type: String
    },
    address: {
        type: String,
    }
});

module.exports = Hotel