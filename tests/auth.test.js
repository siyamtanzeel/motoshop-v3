const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/User");

let token;

describe("Auth API", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("token");
  });

  it("should not register with existing email", async () => {
    await User.create({
      name: "Test",
      email: "dup@example.com",
      password: "pass",
    });
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test", email: "dup@example.com", password: "pass" });
    expect(res.statusCode).toBe(400);
  });

  it("should login with correct credentials", async () => {
    await User.create({
      name: "Login",
      email: "login@example.com",
      password: "password123",
    });
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "login@example.com", password: "password123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("token");
    token = res.body.user.token;
  });

  it("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "login@example.com", password: "wrongpass" });
    expect(res.statusCode).toBe(401);
  });

  it("should handle forgot password", async () => {
    await User.create({
      name: "Forgot",
      email: "forgot@example.com",
      password: "password123",
    });
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "forgot@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
