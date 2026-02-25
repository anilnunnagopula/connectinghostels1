// Runs once after all test suites (outside Jest worker context)
module.exports = async () => {
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
};
