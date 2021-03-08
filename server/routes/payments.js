const express = require('express');
const router = express.Router();
const Payments = require('../models/payments');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
    const {data, id} = req.body;

    var customer = await stripe.customers.create({
        name: data.name,
        email: data.mail,
        phone: data.contact,
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
        metadata: {
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            email: data.email,
            name: data.name,
            contact: data.contact
        },
        receipt_email: data.email,
        customer: customer.id,
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
        // const newPayment = new Payments(data);
        // newPayment.save((error) => {
        //     if (error) {
        //         console.log('Oops something went wrong');
        //         return res.status(500).json({
        //             error: error,
        //             message: error.message
        //         })
        //     } else {
        //         console.log('Payment Successful');
        //         return res.status(201).json({
        //             message: 'Payment Successful'
        //         })
        //     }
        // })
        res.status(200).json({
            data: payment.charges.data[0].receipt_url,
            message: 'Payment Succesful'
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
        const paymentHistory = await stripe.paymentIntents.list({});
        const paymentData = (paymentHistory.data.map((item) => {
            return {name: item.metadata.name, amount: item.amount, checkIn: item.metadata.checkIn, checkOut: item.metadata.checkOut, contact: item.metadata.contact, email: item.metadata.email}
        }));
        return res.status(200).json({
            message: 'Fetched Payment History Successfully',
            data: paymentData
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message,
            error: error
        })
    }

})


module.exports = router;