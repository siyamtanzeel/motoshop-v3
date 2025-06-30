const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: "Bike", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, bike: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
