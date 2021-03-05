const express = require('express');
const router = express.Router();
const Payments = require('../models/payments');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
    const {data, id} = req.body;

    var customer = await stripe.customers.create({
        name: data.name,
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        }
      });

    const payment = await stripe.paymentIntents.create({
        amount: data.amount,
        shipping: {
            name: data.name,
            address: {
              line1: '510 Townsend St',
              postal_code: '98140',
              city: 'San Francisco',
              state: 'CA',
              country: 'US',
            }
          },
        currency: 'USD',
        description: `Hotel Booking from ${data.dateSelection.startDate} to ${data.dateSelection.endDate}`,
        payment_method: id,
        confirm: true
    });

    if (!payment.error) {
        const newPayment = new Payments(data);
        newPayment.save((error) => {
            if (error) {
                console.log('Oops something went wrong');
                return res.status(500).json({
                    error: error,
                    message: error.message
                })
            } else {
                console.log('Payment Successful');
                return res.status(201).json({
                    message: 'Payment Successful'
                })
            }
        })
    } else {
        return res.status(500).json({
            message: payment.error.message,
            error: error
        })
    }
});


router.get('/', async (req, res) => {
    try {
        const response = await Payments.find({});
        console.log(response);
        return res.status(200).json({
            message: 'Fetched Data Successfully',
            data: response
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message,
            error: error
        })
    }

})


module.exports = router;