const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Set up email transporter using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or another email service
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Email sending endpoint
app.post('/send-email', (req, res) => {
    const { toEmail, fromEmail, subject, message } = req.body;

    console.log('Request Body:', req.body); // Log the request body to check the incoming data

    const fullMessage = `Sender Email: ${fromEmail}\n\n${message}`;

    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: fullMessage,
        replyTo: fromEmail
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); // Log the full error
            return res.status(500).send(`Failed to send email: ${error.message}`);
        }
        console.log('Email sent:', info.response); // Log successful response
        res.send('Email sent successfully!');
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
