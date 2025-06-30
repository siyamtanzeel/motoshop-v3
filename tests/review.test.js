const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/User");
const Bike = require("../models/Bike");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

let userToken, bikeId, reviewId;

describe("Review API", () => {
  beforeAll(async () => {
    const user = await User.create({
      name: "User",
      email: "user@ex.com",
      password: "pass",
    });
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "user@ex.com", password: "pass" });
    userToken = login.body.user.token;
    const brand = await Brand.create({ name: "Suzuki" });
    const category = await Category.create({ name: "Naked" });
    const bike = await Bike.create({
      name: "Gixxer",
      brand: brand._id,
      category: category._id,
      price: 80,
      stock: 5,
    });
    bikeId = bike._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a review", async () => {
    const res = await request(app)
      .post("/api/v1/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ bike: bikeId, rating: 5, comment: "Great!" });
    expect(res.statusCode).toBe(201);
    expect(res.body.review.rating).toBe(5);
    reviewId = res.body.review._id;
  });

  it("should not allow duplicate review", async () => {
    const res = await request(app)
      .post("/api/v1/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ bike: bikeId, rating: 4, comment: "Again!" });
    expect(res.statusCode).toBe(400);
  });

  it("should get bike reviews", async () => {
    const res = await request(app).get(`/api/v1/reviews/bike/${bikeId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.reviews)).toBe(true);
  });

  it("should get bike rating stats", async () => {
    const res = await request(app).get(`/api/v1/reviews/bike/${bikeId}/stats`);
    expect(res.statusCode).toBe(200);
    expect(res.body.stats).toHaveProperty("avgRating");
  });

  it("should update a review", async () => {
    const res = await request(app)
      .put(`/api/v1/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ rating: 4 });
    expect(res.statusCode).toBe(200);
    expect(res.body.review.rating).toBe(4);
  });

  it("should delete a review", async () => {
    const res = await request(app)
      .delete(`/api/v1/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
