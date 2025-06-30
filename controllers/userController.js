const User = require("../models/User.js");

const blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  user.isBlocked = true;
  await user.save();
  res.json({ success: true, message: "User blocked" });
};

const unblockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  user.isBlocked = false;
  await user.save();
  res.json({ success: true, message: "User unblocked" });
};

module.exports = {
  blockUser,
  unblockUser,
};
