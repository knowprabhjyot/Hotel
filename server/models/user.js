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
    hotel: {
        type: {
            id: Number,
            name: String
        },
        required: true
    }
});

module.exports = User