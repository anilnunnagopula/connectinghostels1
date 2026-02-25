require("./setup");
const request = require("supertest");
const app = require("../app");

describe("Health endpoint", () => {
  it("GET /health → 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("GET /api/health → 200 (legacy path)", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/nonexistent → 404", async () => {
    const res = await request(app).get("/api/nonexistent-route-xyz");
    expect(res.status).toBe(404);
  });
});
