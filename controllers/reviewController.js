const Review = require("../models/Review.js");
const Bike = require("../models/Bike.js");

module.exports = {
  createReview: async (req, res) => {
    const { bike, rating, comment } = req.body;
    const exists = await Review.findOne({ user: req.user._id, bike });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "You already reviewed this bike" });
    const review = await Review.create({
      user: req.user._id,
      bike,
      rating,
      comment,
    });
    res.status(201).json({ success: true, review });
  },

  getBikeReviews: async (req, res) => {
    const reviews = await Review.find({ bike: req.params.bikeId }).populate(
      "user",
      "name"
    );
    res.json({ success: true, reviews });
  },

  updateReview: async (req, res) => {
    const { rating, comment } = req.body;
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();
    res.json({ success: true, review });
  },

  deleteReview: async (req, res) => {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    await review.remove();
    res.json({ success: true, message: "Review deleted" });
  },

  getBikeRatingStats: async (req, res) => {
    const stats = await Review.aggregate([
      {
        $match: {
          bike: new Bike().constructor.Types.ObjectId(req.params.bikeId),
        },
      },
      {
        $group: {
          _id: "$bike",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);
    res.json({
      success: true,
      stats: stats[0] || { avgRating: 0, reviewCount: 0 },
    });
  },
};
