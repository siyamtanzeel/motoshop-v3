const express = require("express");
const {
  createPromoCode,
  getPromoCodes,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
} = require("../controllers/promoCodeController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const router = express.Router();

router.get("/", getPromoCodes);
router.post(
  "/",
  protect,
  roleMiddleware("admin", "superadmin"),
  createPromoCode
);
router.put(
  "/:id",
  protect,
  roleMiddleware("admin", "superadmin"),
  updatePromoCode
);
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin", "superadmin"),
  deletePromoCode
);
router.post("/validate", validatePromoCode);

module.exports = router;
