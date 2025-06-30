const PromoCode = require("../models/PromoCode.js");

module.exports = {
  createPromoCode: async (req, res) => {
    const { code, discountType, discountValue, minOrder, expiresAt, isActive } =
      req.body;
    const exists = await PromoCode.findOne({ code });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Promo code already exists" });
    const promo = await PromoCode.create({
      code,
      discountType,
      discountValue,
      minOrder,
      expiresAt,
      isActive,
    });
    res.status(201).json({ success: true, promo });
  },

  getPromoCodes: async (req, res) => {
    const promos = await PromoCode.find();
    res.json({ success: true, promos });
  },

  updatePromoCode: async (req, res) => {
    const { code, discountType, discountValue, minOrder, expiresAt, isActive } =
      req.body;
    const promo = await PromoCode.findById(req.params.id);
    if (!promo)
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found" });
    promo.code = code || promo.code;
    promo.discountType = discountType || promo.discountType;
    promo.discountValue = discountValue || promo.discountValue;
    promo.minOrder = minOrder || promo.minOrder;
    promo.expiresAt = expiresAt || promo.expiresAt;
    promo.isActive = isActive !== undefined ? isActive : promo.isActive;
    await promo.save();
    res.json({ success: true, promo });
  },

  deletePromoCode: async (req, res) => {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo)
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found" });
    await promo.remove();
    res.json({ success: true, message: "Promo code deleted" });
  },

  validatePromoCode: async (req, res) => {
    const { code, orderTotal } = req.body;
    const promo = await PromoCode.findOne({
      code,
      isActive: true,
      expiresAt: { $gt: Date.now() },
    });
    if (!promo)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired promo code" });
    if (orderTotal < promo.minOrder)
      return res
        .status(400)
        .json({
          success: false,
          message: `Minimum order is ${promo.minOrder}`,
        });
    let discount = 0;
    if (promo.discountType === "percent") {
      discount = (orderTotal * promo.discountValue) / 100;
    } else {
      discount = promo.discountValue;
    }
    res.json({ success: true, discount, promo });
  },
};
