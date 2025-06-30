const SSLCommerzPayment = require("sslcommerz-lts");
const { sslcommerzConfig } = require("../config/sslcommerz.js");

const initiatePayment = async (order, user, req) => {
  const tran_id = order._id.toString();
  const data = {
    total_amount: order.totalPrice,
    currency: "BDT",
    tran_id,
    success_url: `${req.protocol}://${req.get("host")}/api/orders/success`,
    fail_url: `${req.protocol}://${req.get("host")}/api/orders/fail`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/orders/cancel`,
    ipn_url: `${req.protocol}://${req.get("host")}/api/orders/ipn`,
    product_name: "Bike Order",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: "Customer Address",
    cus_phone: "Customer Phone",
    shipping_method: "NO",
    product_category: "Bike",
    product_profile: "general",
  };
  const sslcz = new SSLCommerzPayment(
    sslcommerzConfig.store_id,
    sslcommerzConfig.store_passwd,
    sslcommerzConfig.is_live
  );
  return await sslcz.init(data);
};

module.exports = {
  initiatePayment,
};
