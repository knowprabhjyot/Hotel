const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

module.exports = {
    getPaymentHistory,
    createPayment,
    createRequest
};

async function createPayment(data, id, user) {
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


async function createRequest(data, user) {
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
            author: user
        }
    })

    const invoice = await stripe.invoices.create({
        customer: customer.id,
        auto_advance: true,
        collection_method: 'send_invoice',
        days_until_due: 5,
    });

    return invoice;
}


async function getPaymentHistory() {
    const paymentHistory = await stripe.paymentIntents.list({});
    const paymentData = (paymentHistory.data.map((item) => {
        return {name: item.metadata.name, amount: item.amount, author: item.metadata.author, checkIn: item.metadata.checkIn, checkOut: item.metadata.checkOut, contact: item.metadata.contact, email: item.metadata.email}
    }));
    return paymentData;
}

