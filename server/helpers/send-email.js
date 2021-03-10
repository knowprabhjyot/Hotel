const nodemailer = require('nodemailer');
const config = require('config.json');

module.exports = sendEmail;

async function sendEmail(email, password) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,//replace with your email
            pass: process.env.PASSWORD//replace with your password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL2,//replace with your email
        to: process.env.EMAIL,//replace with your email
        subject: `FORGOT PASSWORD EMAIL`,
        html: `Hi There,
            <h2> Your current password for Big Payments Solution is :  </h2><br>
            <h2> Email: ${email} </h2><br>
            <h2> Password:${password} </h2><br>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send('error') // if error occurs send error as response to client
        }
        else {
            console.log('Email sent: ' + info.response);
            res.send('Sent Successfully')//if mail is sent successfully send Sent successfully as response
        }
    });
}