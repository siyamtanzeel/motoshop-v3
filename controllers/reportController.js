const Order = require("../models/Order.js");
const User = require("../models/User.js");
const Bike = require("../models/Bike.js");

module.exports = {
  getDashboardStats: async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$finalPrice" } } },
    ]);
    const totalUsers = await User.countDocuments();
    const bestSelling = await Order.aggregate([
      { $unwind: "$bikes" },
      { $group: { _id: "$bikes.bike", sold: { $sum: "$bikes.qty" } } },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "bikes",
          localField: "_id",
          foreignField: "_id",
          as: "bike",
        },
      },
      { $unwind: "$bike" },
      { $project: { _id: 0, bike: "$bike", sold: 1 } },
    ]);
    res.json({
      success: true,
      stats: {
        totalOrders,
        totalSales: totalSales[0]?.total || 0,
        totalUsers,
        bestSelling,
      },
    });
  },

  getSalesReport: async (req, res) => {
    const { period = "daily" } = req.query;
    let groupBy = {};
    if (period === "daily")
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    else if (period === "weekly")
      groupBy = {
        year: { $year: "$createdAt" },
        week: { $week: "$createdAt" },
      };
    else if (period === "monthly")
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    const report = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$finalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } },
    ]);
    res.json({ success: true, report });
  },
};
