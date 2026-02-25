// Runs once before all test suites (outside Jest worker context)
const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-at-least-32-characters-long";
  process.env.NODE_ENV = "test";
  // Stub payment keys so Razorpay initialises without crashing at require-time
  process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_fake";
  process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "fake_secret_value";
  // Store instance so globalTeardown can stop it
  global.__MONGOD__ = mongod;
};
