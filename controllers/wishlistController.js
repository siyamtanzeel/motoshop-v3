const Wishlist = require("../models/Wishlist.js");

module.exports = {
  getWishlist: async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "bikes"
    );
    if (!wishlist)
      wishlist = await Wishlist.create({ user: req.user._id, bikes: [] });
    res.json({ success: true, wishlist });
  },

  addToWishlist: async (req, res) => {
    const { bikeId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist)
      wishlist = await Wishlist.create({ user: req.user._id, bikes: [] });
    if (!wishlist.bikes.includes(bikeId)) wishlist.bikes.push(bikeId);
    await wishlist.save();
    res.json({ success: true, wishlist });
  },

  removeFromWishlist: async (req, res) => {
    const { bikeId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist)
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    wishlist.bikes = wishlist.bikes.filter((id) => id.toString() !== bikeId);
    await wishlist.save();
    res.json({ success: true, wishlist });
  },

  clearWishlist: async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist)
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    wishlist.bikes = [];
    await wishlist.save();
    res.json({ success: true, wishlist });
  },
};
