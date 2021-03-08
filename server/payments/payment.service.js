const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

module.exports = {
    getPaymentHistory,
    createPayment,
};

async function createPayment(data, id, user) {
    const customer = await stripe.customers.create({
        name: data.name,
        email: data.mail,
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
            author: user
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


async function getPaymentHistory() {
    const paymentHistory = await stripe.paymentIntents.list({});
    const paymentData = (paymentHistory.data.map((item) => {
        return {name: item.metadata.name, amount: item.amount, author: item.metadata.author, checkIn: item.metadata.checkIn, checkOut: item.metadata.checkOut, contact: item.metadata.contact, email: item.metadata.email}
    }));
    return paymentData;
}

