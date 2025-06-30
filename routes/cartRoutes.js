const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.post("/update", protect, updateCartItem);
router.post("/remove", protect, removeFromCart);
router.post("/clear", protect, clearCart);

module.exports = router;
