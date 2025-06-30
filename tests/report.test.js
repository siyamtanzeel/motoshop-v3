const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/User");

let adminToken;

describe("Report API", () => {
  beforeAll(async () => {
    const admin = await User.create({
      name: "Admin",
      email: "admin@ex.com",
      password: "pass",
      role: "admin",
    });
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@ex.com", password: "pass" });
    adminToken = login.body.user.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should get dashboard stats (admin)", async () => {
    const res = await request(app)
      .get("/api/v1/reports/dashboard")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.stats).toHaveProperty("totalOrders");
  });

  it("should get sales report (admin)", async () => {
    const res = await request(app)
      .get("/api/v1/reports/sales?period=daily")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.report)).toBe(true);
  });

  it("should not allow non-admin", async () => {
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
      .get("/api/v1/reports/dashboard")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });
});
