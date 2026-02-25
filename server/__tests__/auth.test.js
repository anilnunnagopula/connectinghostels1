require("./setup");
const request = require("supertest");
const app = require("../app");

// Valid registration payload
const validUser = {
  name: "Test Student",
  email: "student@test.com",
  phone: "9876543210",
  password: "Password123!",
  role: "student",
};

describe("Auth — register", () => {
  it("POST /api/auth/register → 201 with user payload and cookie", async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({
      name: validUser.name,
      email: validUser.email,
      role: "student",
    });
    // httpOnly cookie should be set
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toMatch(/token=/);
  });

  it("POST /api/auth/register duplicate email → 409", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app).post("/api/auth/register").send(validUser);
    expect(res.status).toBe(409);
  });

  it("POST /api/auth/register missing required fields → 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "x@x.com", password: "pass" });
    expect(res.status).toBe(400);
  });

  it("POST /api/auth/register as owner requires hostelName → 400", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Owner",
      email: "owner@test.com",
      phone: "9000000001",
      password: "Password123!",
      role: "owner",
      // hostelName intentionally omitted
    });
    expect(res.status).toBe(400);
  });
});

describe("Auth — login", () => {
  beforeEach(async () => {
    // Seed a user to login as
    await request(app).post("/api/auth/register").send(validUser);
  });

  it("POST /api/auth/login valid credentials → 200 + cookie", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: validUser.email,
      password: validUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("POST /api/auth/login wrong password → 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: validUser.email,
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/login unknown email → 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@test.com",
      password: "Password123!",
    });
    expect(res.status).toBe(401);
  });
});

describe("Auth — profile", () => {
  let cookie;

  beforeEach(async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);
    // Extract the Set-Cookie header for subsequent requests
    cookie = res.headers["set-cookie"][0].split(";")[0]; // "token=xxx"
  });

  it("GET /api/auth/profile with valid cookie → 200", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.user || res.body).toMatchObject({ email: validUser.email });
  });

  it("GET /api/auth/profile without cookie → 401", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/logout → 200 and clears cookie", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    // The Set-Cookie should set token to empty / expire it
    const setCookie = res.headers["set-cookie"]?.[0] || "";
    expect(setCookie).toMatch(/token=/);
  });
});
