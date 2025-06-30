const express = require("express");
const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const router = express.Router();

router.get("/", getBrands);
router.post("/", protect, roleMiddleware("admin", "superadmin"), createBrand);
router.put("/:id", protect, roleMiddleware("admin", "superadmin"), updateBrand);
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin", "superadmin"),
  deleteBrand
);

module.exports = router;
