const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/User");
const Bike = require("../models/Bike");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const PromoCode = require("../models/PromoCode");

jest.mock("../services/paymentService", () => ({
  initiatePayment: jest.fn(() =>
    Promise.resolve({ tran_id: "mock_tran", GatewayPageURL: "http://mockpay" })
  ),
}));

let userToken, adminToken, bikeId, orderId, promoCode;

describe("Order API", () => {
  beforeAll(async () => {
    const user = await User.create({
      name: "User",
      email: "user@ex.com",
      password: "pass",
    });
    const admin = await User.create({
      name: "Admin",
      email: "admin@ex.com",
      password: "pass",
      role: "admin",
    });
    const loginUser = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "user@ex.com", password: "pass" });
    userToken = loginUser.body.user.token;
    const loginAdmin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@ex.com", password: "pass" });
    adminToken = loginAdmin.body.user.token;
    const brand = await Brand.create({ name: "Honda" });
    const category = await Category.create({ name: "Commuter" });
    const bike = await Bike.create({
      name: "CBR",
      brand: brand._id,
      category: category._id,
      price: 100,
      stock: 10,
    });
    bikeId = bike._id;
    promoCode = await PromoCode.create({
      code: "SAVE10",
      discountType: "percent",
      discountValue: 10,
      minOrder: 50,
      expiresAt: new Date(Date.now() + 1000000),
      isActive: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should place an order (user, with promo)", async () => {
    const res = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        bikes: [{ bike: bikeId, qty: 1 }],
        totalPrice: 100,
        promoCode: "SAVE10",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.order).toHaveProperty("paymentUrl");
    expect(res.body.order.discount).toBeGreaterThan(0);
    orderId = res.body.order._id;
  });

  it("should not place order without token", async () => {
    const res = await request(app)
      .post("/api/v1/orders")
      .send({ bikes: [{ bike: bikeId, qty: 1 }], totalPrice: 100 });
    expect(res.statusCode).toBe(401);
  });

  it("should update order status (admin)", async () => {
    const res = await request(app)
      .put(`/api/v1/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipped", note: "Shipped by admin" });
    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe("shipped");
  });

  it("should get order timeline (user)", async () => {
    const res = await request(app)
      .get(`/api/v1/orders/${orderId}/timeline`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.timeline)).toBe(true);
  });
});
