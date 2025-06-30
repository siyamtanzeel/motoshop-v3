const express = require("express");
const { blockUser, unblockUser } = require("../controllers/userController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const { roleMiddleware } = require("../middlewares/roleMiddleware.js");
const router = express.Router();

router.put(
  "/:id/block",
  protect,
  roleMiddleware("admin", "superadmin"),
  blockUser
);
router.put(
  "/:id/unblock",
  protect,
  roleMiddleware("admin", "superadmin"),
  unblockUser
);

module.exports = router;
