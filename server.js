const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware.js");
const { connectDB } = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const bikeRoutes = require("./routes/bikeRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const brandRoutes = require("./routes/brandRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const promoCodeRoutes = require("./routes/promoCodeRoutes.js");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"), "utf8")
);

// Load env vars
dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bikes", bikeRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/promocodes", promoCodeRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 handler
app.use(notFound);
// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
