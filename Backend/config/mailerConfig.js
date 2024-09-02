const nodemailer = require("nodemailer");

// Load environment variables
require("dotenv").config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

module.exports = createTransporter;
