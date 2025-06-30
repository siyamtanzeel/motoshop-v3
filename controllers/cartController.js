const Cart = require("../models/Cart.js");

module.exports = {
  getCart: async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.bike"
    );
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json({ success: true, cart });
  },

  addToCart: async (req, res) => {
    const { bikeId, qty } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const item = cart.items.find((i) => i.bike.toString() === bikeId);
    if (item) {
      item.qty += qty;
    } else {
      cart.items.push({ bike: bikeId, qty });
    }
    await cart.save();
    res.json({ success: true, cart });
  },

  updateCartItem: async (req, res) => {
    const { bikeId, qty } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    const item = cart.items.find((i) => i.bike.toString() === bikeId);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    item.qty = qty;
    await cart.save();
    res.json({ success: true, cart });
  },

  removeFromCart: async (req, res) => {
    const { bikeId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    cart.items = cart.items.filter((i) => i.bike.toString() !== bikeId);
    await cart.save();
    res.json({ success: true, cart });
  },

  clearCart: async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    cart.items = [];
    await cart.save();
    res.json({ success: true, cart });
  },
};
