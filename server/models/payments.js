const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hotel: {
        type: String,
        required: true
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    contact: {
        type: Number,
        required: true
    }
});

const Payments = mongoose.model('Payments', PaymentSchema);
module.exports = Payments;