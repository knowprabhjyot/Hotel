const mongoose = require('mongoose');
const User = mongoose.model('User', {
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    hotels: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'}],
        required: true
    }
});

module.exports = User