const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`,
  });
};

const sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
  });
};

const sendOrderConfirmationEmail = async (to, order) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Order Confirmation",
    html: `<h2>Order Confirmed</h2><p>Your order (${
      order._id
    }) has been placed successfully. Total: ${
      order.finalPrice || order.totalPrice
    }৳</p>`,
  });
};

const sendOrderStatusUpdateEmail = async (to, order, status) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Order Status Updated",
    html: `<h2>Order Status Update</h2><p>Your order (${order._id}) status is now: <b>${status}</b>.</p>`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
