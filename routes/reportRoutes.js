const express = require("express");
const {
  getDashboardStats,
  getSalesReport,
} = require("../controllers/reportController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const router = express.Router();

router.get(
  "/dashboard",
  protect,
  roleMiddleware("admin", "superadmin"),
  getDashboardStats
);
router.get(
  "/sales",
  protect,
  roleMiddleware("admin", "superadmin"),
  getSalesReport
);

module.exports = router;
