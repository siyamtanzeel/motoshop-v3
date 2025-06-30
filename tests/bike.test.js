const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/User");
const Bike = require("../models/Bike");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

let adminToken, brandId, categoryId, bikeId;

describe("Bike API", () => {
  beforeAll(async () => {
    const admin = await User.create({
      name: "Admin",
      email: "admin@ex.com",
      password: "pass",
      role: "admin",
    });
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@ex.com", password: "pass" });
    adminToken = res.body.user.token;
    const brand = await Brand.create({ name: "Yamaha" });
    brandId = brand._id;
    const category = await Category.create({ name: "Sports" });
    categoryId = category._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new bike (admin)", async () => {
    const res = await request(app)
      .post("/api/v1/bikes")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "R15",
        brand: brandId,
        category: categoryId,
        price: 100,
        image: "",
        stock: 5,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.bike.name).toBe("R15");
    bikeId = res.body.bike._id;
  });

  it("should get all bikes", async () => {
    const res = await request(app).get("/api/v1/bikes");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.bikes)).toBe(true);
  });

  it("should update a bike (admin)", async () => {
    const res = await request(app)
      .put(`/api/v1/bikes/${bikeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 120 });
    expect(res.statusCode).toBe(200);
    expect(res.body.bike.price).toBe(120);
  });

  it("should delete a bike (admin)", async () => {
    const res = await request(app)
      .delete(`/api/v1/bikes/${bikeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/removed/i);
  });

  it("should not allow non-admin to create bike", async () => {
    const user = await User.create({
      name: "User",
      email: "user@ex.com",
      password: "pass",
    });
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "user@ex.com", password: "pass" });
    const userToken = login.body.user.token;
    const res = await request(app)
      .post("/api/v1/bikes")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "FZ",
        brand: brandId,
        category: categoryId,
        price: 90,
        image: "",
        stock: 2,
      });
    expect(res.statusCode).toBe(403);
  });
});
