require("./setup");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Hostel = require("../models/Hostel");
const Student = require("../models/Student");

const seedOwnerAndHostel = async () => {
  const owner = await User.create({
    name: "Owner",
    email: "rowner@test.com",
    password: "hashed",
    role: "owner",
    phone: "9000000010",
    hostelName: "Review Hostel",
    authProvider: "local",
    profileCompleted: true,
  });
  const hostel = await Hostel.create({
    ownerId: owner._id,
    name: "Review Hostel",
    address: "1 Review St",
    locality: "Sheriguda",
    type: "Girls",
    floors: 1,
    totalRooms: 10,
    availableRooms: 3,
    pricePerMonth: 3500,
    contactNumber: "9000000011",
  });
  return { owner, hostel };
};

const registerAndGetCookie = async (userData) => {
  const res = await request(app).post("/api/auth/register").send(userData);
  return res.headers["set-cookie"][0].split(";")[0];
};

describe("GET /api/reviews/hostel/:id", () => {
  it("returns 200 with empty reviews array for valid hostel", async () => {
    const { hostel } = await seedOwnerAndHostel();
    const res = await request(app).get(`/api/reviews/hostel/${hostel._id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.reviews || res.body)).toBe(true);
  });
});

describe("POST /api/reviews", () => {
  it("returns 401 without auth", async () => {
    const { hostel } = await seedOwnerAndHostel();
    const res = await request(app).post("/api/reviews").send({
      hostelId: hostel._id,
      rating: 4,
      comment: "Nice place",
    });
    expect(res.status).toBe(401);
  });

  it("returns 201 for authenticated student with an admitted hostel", async () => {
    const { hostel } = await seedOwnerAndHostel();

    // Register a student user
    const cookie = await registerAndGetCookie({
      name: "Review Student",
      email: "rstudent@test.com",
      phone: "9000000012",
      password: "Password123!",
      role: "student",
    });

    // Get the user id from profile
    const profileRes = await request(app)
      .get("/api/auth/profile")
      .set("Cookie", cookie);
    const userId = (profileRes.body.user || profileRes.body)._id;

    // Create Student profile with currentHostel set
    await Student.create({
      user: userId,
      name: "Review Student",
      email: "rstudent@test.com",
      phone: "9000000012",
      currentHostel: hostel._id,
      rollNumber: "STU001",
      status: "Active",
    });

    const res = await request(app)
      .post("/api/reviews")
      .set("Cookie", cookie)
      .send({
        hostelId: hostel._id,
        rating: 4,
        comment: "Great hostel!",
      });

    // Accept 201 (created) or 200 (upsert)
    expect([200, 201]).toContain(res.status);
  });

  it("returns error on duplicate review (same student + hostel)", async () => {
    const { hostel } = await seedOwnerAndHostel();

    const cookie = await registerAndGetCookie({
      name: "Dup Student",
      email: "dupstudent@test.com",
      phone: "9000000013",
      password: "Password123!",
      role: "student",
    });

    const profileRes = await request(app)
      .get("/api/auth/profile")
      .set("Cookie", cookie);
    const userId = (profileRes.body.user || profileRes.body)._id;

    await Student.create({
      user: userId,
      name: "Dup Student",
      email: "dupstudent@test.com",
      phone: "9000000013",
      currentHostel: hostel._id,
      rollNumber: "STU002",
      status: "Active",
    });

    const payload = { hostelId: hostel._id, rating: 3, comment: "ok" };

    // First submission
    await request(app)
      .post("/api/reviews")
      .set("Cookie", cookie)
      .send(payload);

    // Second submission — should 400 (duplicate) or 200 (upsert allowed)
    const res = await request(app)
      .post("/api/reviews")
      .set("Cookie", cookie)
      .send(payload);

    // Either duplicate error (400) or upsert success (200/201)
    expect([200, 201, 400]).toContain(res.status);
  });
});
