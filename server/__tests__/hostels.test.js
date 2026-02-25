require("./setup");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Hostel = require("../models/Hostel");
const User = require("../models/User");

// Helper: create an owner + hostel and return the hostel doc
const seedHostel = async (overrides = {}) => {
  const owner = await User.create({
    name: "Hostel Owner",
    email: "owner@hostel.com",
    password: "hashed",
    role: "owner",
    phone: "9000000001",
    hostelName: "Test Hostel",
    authProvider: "local",
    profileCompleted: true,
  });

  return Hostel.create({
    ownerId: owner._id,
    name: overrides.name || "Sunrise Hostel",
    address: "123 Main St",
    locality: overrides.locality || "Mangalpally",
    type: "Boys",
    floors: 2,
    totalRooms: 20,
    availableRooms: 5,
    pricePerMonth: 4500,
    contactNumber: "9000000002",
    ...overrides,
  });
};

describe("GET /api/hostels", () => {
  it("returns paginated hostels object (empty DB)", async () => {
    const res = await request(app).get("/api/hostels");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("hostels");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.hostels)).toBe(true);
  });

  it("returns seeded hostels", async () => {
    await seedHostel({ name: "Alpha Hostel" });
    const res = await request(app).get("/api/hostels");
    expect(res.status).toBe(200);
    expect(res.body.hostels.length).toBeGreaterThanOrEqual(1);
  });

  it("filters by locality", async () => {
    await seedHostel({ locality: "Ibrahimpatnam", name: "Beta Hostel" });
    const res = await request(app).get("/api/hostels?locality=Ibrahimpatnam");
    expect(res.status).toBe(200);
    res.body.hostels.forEach((h) => expect(h.locality).toBe("Ibrahimpatnam"));
  });

  it("search param returns matching hostels", async () => {
    await seedHostel({ name: "Sunrise Hostel" });
    const res = await request(app).get("/api/hostels?search=Sunrise");
    expect(res.status).toBe(200);
    expect(res.body.hostels.some((h) => h.name.includes("Sunrise"))).toBe(true);
  });
});

describe("GET /api/hostels/:id", () => {
  it("returns 200 with hostel for valid ObjectId", async () => {
    const hostel = await seedHostel();
    const res = await request(app).get(`/api/hostels/${hostel._id}`);
    expect(res.status).toBe(200);
    expect(res.body.hostel?._id || res.body._id).toBeTruthy();
  });

  it("returns 404 for unknown ObjectId", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/hostels/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
