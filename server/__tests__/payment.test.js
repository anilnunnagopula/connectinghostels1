require("./setup");
const request = require("supertest");
const crypto = require("crypto");
const mongoose = require("mongoose");

// ---------------------------------------------------------------------------
// Mock Razorpay before any imports so the controller's `new Razorpay()` call
// receives the mock implementation.
// ---------------------------------------------------------------------------
jest.mock("razorpay", () =>
  jest.fn().mockImplementation(() => ({
    orders: {
      create: jest.fn().mockResolvedValue({
        id: "order_testABC123",
        amount: 500000,
        currency: "INR",
      }),
    },
  }))
);

const app = require("../app");
const User = require("../models/User");
const Hostel = require("../models/Hostel");
const Student = require("../models/Student");
const Payment = require("../models/Payment");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const registerAndGetCookie = async (userData) => {
  const res = await request(app).post("/api/auth/register").send(userData);
  return res.headers["set-cookie"][0].split(";")[0];
};

/** Seed a student user + matching Student profile, return cookie + student doc */
const seedStudentWithProfile = async (suffix = "1") => {
  const email = `pay_student_${suffix}_${Date.now()}@test.com`;
  // Use a fixed valid Indian mobile number — afterEach clears the DB so no collision
  const cookie = await registerAndGetCookie({
    name: `PayStudent${suffix}`,
    email,
    phone: "9200000001",
    password: "Password123!",
    role: "student",
  });
  const profileRes = await request(app).get("/api/auth/profile").set("Cookie", cookie);
  const userId = (profileRes.body.user || profileRes.body)._id;
  const studentProfile = await Student.create({
    user: userId,
    name: `PayStudent${suffix}`,
    email,
    phone: `920000000${suffix}`,
    status: "Active",
  });
  return { cookie, studentProfile, email };
};

const generateSignature = (orderId, paymentId) =>
  crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Payment — auth", () => {
  it("GET /api/payments/my-payments unauthenticated → 401", async () => {
    const res = await request(app).get("/api/payments/my-payments");
    expect(res.status).toBe(401);
  });

  it("POST /api/payments/create-order unauthenticated → 401", async () => {
    const res = await request(app)
      .post("/api/payments/create-order")
      .send({ amount: 5000 });
    expect(res.status).toBe(401);
  });
});

describe("Payment — validation", () => {
  it("POST /api/payments/create-order amount < 1 → 400", async () => {
    const { cookie } = await seedStudentWithProfile("v1");
    const res = await request(app)
      .post("/api/payments/create-order")
      .set("Cookie", cookie)
      .send({ amount: 0 });
    expect(res.status).toBe(400);
  });
});

describe("Payment — create order", () => {
  it("POST /api/payments/create-order → 200 with order.id and key_id", async () => {
    const { cookie } = await seedStudentWithProfile("c1");
    const res = await request(app)
      .post("/api/payments/create-order")
      .set("Cookie", cookie)
      .send({ amount: 5000 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order.id).toBeDefined();
    expect(res.body.key_id).toBeDefined();
  });
});

describe("Payment — verify signature", () => {
  it("POST /api/payments/verify invalid signature → 400", async () => {
    const { cookie } = await seedStudentWithProfile("s1");
    const res = await request(app)
      .post("/api/payments/verify")
      .set("Cookie", cookie)
      .send({
        razorpay_order_id: "order_test123",
        razorpay_payment_id: "pay_test123",
        razorpay_signature: "invalidsignature",
        amount: 500000,
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/signature/i);
  });

  it("POST /api/payments/verify valid signature → 200, payment saved", async () => {
    const { cookie } = await seedStudentWithProfile("s2");
    const orderId = "order_valid123";
    const paymentId = "pay_valid123";
    const signature = generateSignature(orderId, paymentId);

    const res = await request(app)
      .post("/api/payments/verify")
      .set("Cookie", cookie)
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        amount: 500000,
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify DB record
    const saved = await Payment.findOne({ razorpay_payment_id: paymentId });
    expect(saved).not.toBeNull();
    expect(saved.status).toBe("success");
  });

  it("POST /api/payments/verify idempotent → 200 on duplicate payment_id", async () => {
    const { cookie, studentProfile } = await seedStudentWithProfile("s3");
    const orderId = "order_dup123";
    const paymentId = "pay_dup123";

    // Pre-insert a payment record
    await Payment.create({
      student: studentProfile._id,
      amount: 5000,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: "somesig",
      status: "success",
    });

    const signature = generateSignature(orderId, paymentId);
    const res = await request(app)
      .post("/api/payments/verify")
      .set("Cookie", cookie)
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        amount: 500000,
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/already processed/i);
  });
});

describe("Payment — my-payments", () => {
  it("GET /api/payments/my-payments → 200 with payments array + pagination", async () => {
    const { cookie, studentProfile } = await seedStudentWithProfile("m1");

    // Insert a payment record
    await Payment.create({
      student: studentProfile._id,
      amount: 3000,
      razorpay_order_id: "order_hist123",
      razorpay_payment_id: "pay_hist123",
      razorpay_signature: "somesig",
      status: "success",
    });

    const res = await request(app)
      .get("/api/payments/my-payments")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.payments)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.payments).toHaveLength(1);
  });
});
