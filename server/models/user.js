const mongoose = require('mongoose');

const user = new mongoose.Schema({
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
    hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true},
}, {
    timestamps: true
})

module.exports = mongoose.model('User', user);