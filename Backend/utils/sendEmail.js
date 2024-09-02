const createTransporter = require("../config/mailerConfig");

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
    return { success: false, message: "Failed to send email" };
  }
};

module.exports = sendEmail;
