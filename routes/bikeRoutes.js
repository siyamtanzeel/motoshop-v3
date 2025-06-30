const express = require("express");
const {
  getBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
} = require("../controllers/bikeController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const router = express.Router();

router.get("/", getBikes);
router.get("/:id", getBikeById);
router.post("/", protect, roleMiddleware("admin", "superadmin"), createBike);
router.put("/:id", protect, roleMiddleware("admin", "superadmin"), updateBike);
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin", "superadmin"),
  deleteBike
);

module.exports = router;
