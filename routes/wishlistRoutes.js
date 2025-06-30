const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/add", protect, addToWishlist);
router.post("/remove", protect, removeFromWishlist);
router.post("/clear", protect, clearWishlist);

module.exports = router;
