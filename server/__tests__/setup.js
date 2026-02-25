// Runs in each Jest worker after the test framework is installed
const mongoose = require("mongoose");

beforeAll(async () => {
  // MONGO_URI is set by globalSetup.js via process.env
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  // Clear all collections between tests so tests are isolated
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
