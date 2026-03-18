const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter using ethereal for simple testing or SMTP for production
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        auth: {
            user: process.env.EMAIL_USER || 'your_email@example.com',
            pass: process.env.EMAIL_PASS || 'your_password',
        },
    });

    // Define email options
    const mailOptions = {
        from: 'Digital Notice Board <noreply@college.edu>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
