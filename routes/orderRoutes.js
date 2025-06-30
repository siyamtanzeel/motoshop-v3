const express = require("express");
const {
  placeOrder,
  updateOrderStatus,
  getOrderTimeline,
} = require("../controllers/orderController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const router = express.Router();

router.post("/", protect, placeOrder);
router.put(
  "/:id/status",
  protect,
  roleMiddleware("admin", "superadmin"),
  updateOrderStatus
);
router.get("/:id/timeline", protect, getOrderTimeline);

module.exports = router;
