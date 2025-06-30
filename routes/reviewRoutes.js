const express = require("express");
const {
  createReview,
  getBikeReviews,
  updateReview,
  deleteReview,
  getBikeRatingStats,
} = require("../controllers/reviewController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.get("/bike/:bikeId", getBikeReviews);
router.get("/bike/:bikeId/stats", getBikeRatingStats);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
