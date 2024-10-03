const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST, // e.g., mail.yourdomain.com
    port: process.env.SMPT_PORT, // e.g., 465 for SSL or 587 for TLS
    secure: process.env.SMPT_PORT == "465", // true for SSL (465), false for TLS (587)
    auth: {
      user: process.env.SMPT_MAIL, // Your cPanel email address
      pass: process.env.SMPT_PASSWORD, // Your cPanel email password
    },
    tls: {
      rejectUnauthorized: false, // Ignore certificate errors for self-signed certificates
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL, // Your cPanel email address
    to: options.email, // Recipient email address
    subject: options.subject, // Email subject
    text: options.message, // Email message content
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
