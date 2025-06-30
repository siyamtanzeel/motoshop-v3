const sslcommerzConfig = {
  store_id: process.env.SSLCOMMERZ_STORE_ID,
  store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
  is_live: false, // Change to true in production
};

module.exports = { sslcommerzConfig };
