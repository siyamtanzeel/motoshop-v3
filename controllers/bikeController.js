const Bike = require("../models/Bike.js");

module.exports = {
  getBikes: async (req, res) => {
    const bikes = await Bike.find().populate("brand").populate("category");
    res.json({ success: true, bikes });
  },

  getBikeById: async (req, res) => {
    const bike = await Bike.findById(req.params.id)
      .populate("brand")
      .populate("category");
    if (bike) {
      res.json({ success: true, bike });
    } else {
      res.status(404).json({ success: false, message: "Bike not found" });
    }
  },

  createBike: async (req, res) => {
    const { name, brand, category, price, description, image, stock } =
      req.body;
    const bike = new Bike({
      name,
      brand,
      category,
      price,
      description,
      image,
      stock,
    });
    await bike.save();
    res.status(201).json({ success: true, bike });
  },

  updateBike: async (req, res) => {
    const bike = await Bike.findById(req.params.id);
    if (bike) {
      const { name, brand, category, price, description, image, stock } =
        req.body;
      bike.name = name || bike.name;
      bike.brand = brand || bike.brand;
      bike.category = category || bike.category;
      bike.price = price || bike.price;
      bike.description = description || bike.description;
      bike.image = image || bike.image;
      bike.stock = stock || bike.stock;
      await bike.save();
      res.json({ success: true, bike });
    } else {
      res.status(404).json({ success: false, message: "Bike not found" });
    }
  },

  deleteBike: async (req, res) => {
    const bike = await Bike.findById(req.params.id);
    if (bike) {
      await bike.remove();
      res.json({ success: true, message: "Bike removed" });
    } else {
      res.status(404).json({ success: false, message: "Bike not found" });
    }
  },
};
