const Order = require("../models/Order.js");
const { initiatePayment } = require("../services/paymentService.js");
const PromoCode = require("../models/PromoCode.js");
const {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} = require("../services/emailService.js");

module.exports = {
  placeOrder: async (req, res) => {
    const { bikes, totalPrice, promoCode } = req.body;
    let discount = 0;
    let appliedPromo = null;
    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode,
        isActive: true,
        expiresAt: { $gt: Date.now() },
      });
      if (promo && totalPrice >= promo.minOrder) {
        if (promo.discountType === "percent") {
          discount = (totalPrice * promo.discountValue) / 100;
        } else {
          discount = promo.discountValue;
        }
        appliedPromo = promo.code;
      }
    }
    const finalPrice = totalPrice - discount;
    const order = await Order.create({
      user: req.user._id,
      bikes,
      totalPrice,
      discount,
      finalPrice,
      promoCode: appliedPromo,
      paymentStatus: "pending",
    });
    // Initiate payment
    const paymentData = await initiatePayment(order, req.user, req);
    order.paymentId = paymentData.tran_id;
    await order.save();
    await sendOrderConfirmationEmail(req.user.email, order);
    res.status(201).json({
      success: true,
      order,
      paymentUrl: paymentData.GatewayPageURL,
    });
  },

  updateOrderStatus: async (req, res) => {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    order.status = status;
    order.statusHistory.push({ status, note });
    await order.save();
    await sendOrderStatusUpdateEmail(order.user.email || "", order, status);
    res.json({ success: true, order });
  },

  getOrderTimeline: async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, timeline: order.statusHistory });
  },
};
