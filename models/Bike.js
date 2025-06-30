const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }, // base64 string
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bike", bikeSchema);
