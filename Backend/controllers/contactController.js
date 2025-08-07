const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// Email transporter setup (Gmail example)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});


exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Save to DB
    const newContact = new Contact({ name, email, phone, subject, message });
    await newContact.save();

    // Send email (log success/error)
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'your-business-email@example.com', // Change this!
      subject: `New Contact: ${subject}`,
      html: `
        <h3>New message from ${name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    const emailResult = await transporter.sendMail(mailOptions);
    console.log('Email sent:', emailResult.response); // Log success

    res.status(200).json({ success: true, message: 'Message sent!' });
  } catch (error) {
    console.error('Email error:', error); // Log detailed error
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};