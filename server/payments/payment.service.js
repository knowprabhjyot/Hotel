const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');
require('dotenv').config();

module.exports = {
    getPaymentHistory,
    createPayment,
    createRequest,
    refundPayment
};

async function createPayment(data, id, user) {
    const userDetails = await User.findById(user);
    console.log(userDetails);
    const customer = await stripe.customers.create({
        name: data.name,
        email: data.email,
        phone: data.contact,
        // Will be changed
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
            contact: data.contact,
            author: user,
            hotel: userDetails.hotel.name,
            hotelId: userDetails.hotel.id,
            createdAt: Date.now()
        },
        receipt_email: data.email,
        customer: customer.id,
        shipping: {
            // Will be changed
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

    return payment.charges.data[0].receipt_url;
}


async function createRequest(data, user) {
    const userDetails = await User.findById(user);
    const customer = await stripe.customers.create({
        name: data.name,
        email: data.email,
        phone: data.contact,
        // Will be changed
        address: {
            line1: '510 Townsend St',
            postal_code: '98140',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
        }
    });

    const invoiceItem = await stripe.invoiceItems.create({
        customer: customer.id,
        amount: data.amount,
        currency: 'usd',
        description: data.description,
        metadata: {
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            email: data.email,
            description: data.description,
            name: data.name,
            contact: data.contact,
            author: user,
            createdAt: Date.now()
        }
    })

    const invoice = await stripe.invoices.create({
        customer: customer.id,
        auto_advance: true,
        collection_method: 'send_invoice',
        metadata: {
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            email: data.email,
            description: data.description,
            name: data.name,
            contact: data.contact,
            author: user,
            hotel: userDetails.hotel.name,
            hotelId: userDetails.hotel.id,
            createdAt: Date.now()
        },
        days_until_due: 5,
    });

    return invoice;
}


async function getPaymentHistory(user, params) {
    const userDetails = await User.findById(user);
    const paymentHistory = await stripe.paymentIntents.list({
        limit: params.limit,
        starting_after: params.starting_after,
        created: {
            lte: params.lte,
            gte: params.gte
        }
    });
    let paymentData = [];

    for (let item of paymentHistory.data) {
        const invoice = (item.invoice) ? item.invoice : null;
        let { metadata } = item;

        if (invoice) {
            const invoiceDetail = await stripe.invoices.retrieve(invoice);
            metadata = invoiceDetail.metadata;
        }

        if (userDetails.role === 'admin') {
            paymentData.push({id: item.id, name: metadata.name, amount: item.amount , author: metadata.author, checkIn: convertDate(metadata.checkIn), checkOut: convertDate(metadata.checkOut), hotel: metadata.hotel, contact: metadata.contact, email: metadata.email, refunded: item.charges.data[0] ? item.charges.data[0].refunded : null, currency: item.currency , createdAt: metadata.createdAt, amountReceived: item.amount_received});
        } else {
            if (userDetails.hotel.id == metadata.hotelId) {
                paymentData.push({id: item.id, name: metadata.name, amount: item.amount, author: metadata.author, checkIn: convertDate(metadata.checkIn), checkOut: convertDate(metadata.checkOut), hotel: metadata.hotel, contact: metadata.contact, email: metadata.email, refunded: item.charges.data[0] ? item.charges.data[0].refunded : null, currency: item.currency , createdAt: metadata.createdAt, amountReceived: item.amount_received});
            }
        }
    }

    return paymentData;
}

const convertDate = (givenDate) => {
    let date = new Date(givenDate);
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
}

async function refundPayment(data, user) {
    const refund = await stripe.refunds.create({
        payment_intent: data.id,
        reason: (data.reason) ? data.reason : 'requested_by_customer',
        amount: data.amount,
        metadata: {
            author: user
        }
    });

    return refund;
}

