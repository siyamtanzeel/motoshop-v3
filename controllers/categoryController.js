const Category = require("../models/Category.js");

module.exports = {
  createCategory: async (req, res) => {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, category });
  },

  getCategories: async (req, res) => {
    const categories = await Category.find();
    res.json({ success: true, categories });
  },

  updateCategory: async (req, res) => {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    res.json({ success: true, category });
  },

  deleteCategory: async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    await category.remove();
    res.json({ success: true, message: "Category deleted" });
  },
};
