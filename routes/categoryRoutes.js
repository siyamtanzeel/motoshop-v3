const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const router = express.Router();

router.get("/", getCategories);
router.post(
  "/",
  protect,
  roleMiddleware("admin", "superadmin"),
  createCategory
);
router.put(
  "/:id",
  protect,
  roleMiddleware("admin", "superadmin"),
  updateCategory
);
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin", "superadmin"),
  deleteCategory
);

module.exports = router;
