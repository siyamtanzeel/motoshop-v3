const Brand = require("../models/Brand.js");

module.exports = {
  createBrand: async (req, res) => {
    const { name, description } = req.body;
    const exists = await Brand.findOne({ name });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Brand already exists" });
    const brand = await Brand.create({ name, description });
    res.status(201).json({ success: true, brand });
  },

  getBrands: async (req, res) => {
    const brands = await Brand.find();
    res.json({ success: true, brands });
  },

  updateBrand: async (req, res) => {
    const { name, description } = req.body;
    const brand = await Brand.findById(req.params.id);
    if (!brand)
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    brand.name = name || brand.name;
    brand.description = description || brand.description;
    await brand.save();
    res.json({ success: true, brand });
  },

  deleteBrand: async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand)
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    await brand.remove();
    res.json({ success: true, message: "Brand deleted" });
  },
};
