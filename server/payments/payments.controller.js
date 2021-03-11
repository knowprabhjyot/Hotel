const express = require('express');
const router = express.Router();
const paymentService = require('../payments/payment.service');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// routes
router.get('/', getPaymentHistory);
router.post('/', createPayment); 
router.post('/request', createRequest); 
router.post('/refund', refundPayment); 
module.exports = router;


function getPaymentHistory(req, res) { 
    paymentService.getPaymentHistory()
        .then((paymentHistory) => {
            res.status(200).json({
                message: 'Fetched Payment History Successfully',
                data: paymentHistory
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: error.message,
                error: error
            })
        });
}

function createPayment(req, res) {
    const {data, id} = req.body;
    const user = req.decoded.sub;
    paymentService.createPayment(data, id, user)
    .then((payment) => {
        if (!payment.error) {
            res.status(201).json({data: payment, message: 'Payment Succesful'})
        } else {
            res.status(500).json({error: error, message: payment.error.message})
        }
    })
    .catch((error) => {
        res.status(500).json({error: error, message: error.message})
    })
}

function createRequest(req, res) {
    const data = req.body;
    const user = req.decoded.sub;
    paymentService.createRequest(data, user)
    .then((payment) => {
        if (!payment.error) {
            res.status(201).json({data: payment, message: 'Request Sent Succesfully'})
        } else {
            res.status(500).json({error: error, message: payment.error.message})
        }
    })
    .catch((error) => {
        res.status(500).json({error: error, message: error.message})
    })
}


function refundPayment(req, res) {
    const data = req.body;
    const user = req.decoded.sub;
    paymentService.refundPayment(data, user)
    .then((refund) => {
        if (!refund.error) {
            res.status(201).json({data: refund, message: 'Refund Sucessful'})
        } else {
            res.status(500).json({error: error, message: refund.error.message})
        }
    })
    .catch((error) => {
        res.status(500).json({error: error, message: error.message})
    })
}
