/**
 * loadtest.js — k6 load test for ConnectingHostels API
 *
 * Usage:
 *   k6 run scripts/loadtest.js
 *   k6 run --env BASE_URL=https://your-api.com scripts/loadtest.js
 *
 * Install k6: https://grafana.com/docs/k6/latest/get-started/installation/
 *
 * Simulates:
 *   40% — Browse hostels (public, GET /api/hostels)
 *   30% — Logged-in student (dashboard, notifications)
 *   20% — Booking actions (student requests page)
 *   10% — Owner dashboard (metrics, requests)
 *
 * Success thresholds:
 *   P95 response time < 800ms
 *   Error rate < 1%
 */

import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

// ─── Config ────────────────────────────────────────────────────────────────
const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

// Pre-generated JWTs for test accounts (set via env or hardcode test tokens here)
// These must correspond to existing test users in your staging DB.
const STUDENT_TOKEN = __ENV.STUDENT_TOKEN || "";
const OWNER_TOKEN   = __ENV.OWNER_TOKEN   || "";

// ─── Custom metrics ─────────────────────────────────────────────────────────
const errorRate  = new Rate("errors");
const browseTime = new Trend("browse_hostel_duration", true);
const dashTime   = new Trend("dashboard_duration", true);

// ─── Load profile ───────────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: "30s", target: 50  },  // ramp up
    { duration: "1m",  target: 200 },  // ramp up to 200
    { duration: "2m",  target: 500 },  // hold at 500 VUs
    { duration: "30s", target: 0   },  // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],   // P95 < 800ms
    errors:            ["rate<0.01"],   // Error rate < 1%
    http_req_failed:   ["rate<0.01"],
  },
};

// ─── Shared headers ─────────────────────────────────────────────────────────
const publicHeaders  = { "Content-Type": "application/json" };
const studentHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${STUDENT_TOKEN}`,
};
const ownerHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OWNER_TOKEN}`,
};

// ─── Scenarios ───────────────────────────────────────────────────────────────

/** 40% — Public browsing */
function browsing() {
  group("Browse Hostels", () => {
    const params = [
      "",
      "?type=Boys",
      "?type=Girls",
      "?locality=Mangalpally",
      "?search=hostel",
      "?page=2",
    ];
    const query = params[Math.floor(Math.random() * params.length)];

    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/hostels${query}`, {
      headers: publicHeaders,
    });
    browseTime.add(Date.now() - start);

    const ok = check(res, {
      "hostels list 200": (r) => r.status === 200,
      "has hostels array": (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.hostels) || Array.isArray(body);
        } catch { return false; }
      },
    });
    errorRate.add(!ok);

    sleep(Math.random() * 2 + 0.5); // 0.5–2.5s think time

    // 50% chance to open a hostel detail
    if (Math.random() > 0.5) {
      try {
        const body = JSON.parse(res.body);
        const list = body.hostels || body;
        if (Array.isArray(list) && list.length > 0) {
          const hostel = list[Math.floor(Math.random() * list.length)];
          const detail = http.get(`${BASE_URL}/api/hostels/${hostel._id}`, {
            headers: publicHeaders,
          });
          check(detail, { "hostel detail 200": (r) => r.status === 200 });
          sleep(Math.random() * 3 + 1);
        }
      } catch { /* ignore */ }
    }
  });
}

/** 30% — Logged-in student */
function studentSession() {
  if (!STUDENT_TOKEN) return browsing(); // fallback if no token

  group("Student Dashboard", () => {
    const start = Date.now();

    const [dashboard, notifications, requests] = [
      http.get(`${BASE_URL}/api/students/dashboard`, { headers: studentHeaders }),
      http.get(`${BASE_URL}/api/notifications`, { headers: studentHeaders }),
      http.get(`${BASE_URL}/api/students/my-requests`, { headers: studentHeaders }),
    ];

    dashTime.add(Date.now() - start);

    const ok = check(dashboard, { "student dashboard 200/401": (r) => r.status === 200 || r.status === 401 })
      && check(notifications, { "notifications 200/401": (r) => r.status === 200 || r.status === 401 });

    errorRate.add(!ok);
    sleep(Math.random() * 3 + 1);
  });
}

/** 20% — Booking actions */
function bookingFlow() {
  if (!STUDENT_TOKEN) return browsing();

  group("Booking Actions", () => {
    const res = http.get(`${BASE_URL}/api/students/my-requests`, {
      headers: studentHeaders,
    });
    const ok = check(res, { "my requests 200/401": (r) => r.status === 200 || r.status === 401 });
    errorRate.add(!ok);
    sleep(Math.random() * 2 + 1);
  });
}

/** 10% — Owner dashboard */
function ownerSession() {
  if (!OWNER_TOKEN) return browsing();

  group("Owner Dashboard", () => {
    const [metrics, requests] = [
      http.get(`${BASE_URL}/api/owner/dashboard/metrics`, { headers: ownerHeaders }),
      http.get(`${BASE_URL}/api/owner/booking-requests/mine`, { headers: ownerHeaders }),
    ];

    const ok = check(metrics, { "owner metrics 200/401": (r) => r.status === 200 || r.status === 401 });
    errorRate.add(!ok);
    sleep(Math.random() * 2 + 1);
  });
}

/** Health check — always fast */
function healthCheck() {
  const res = http.get(`${BASE_URL}/api/health`);
  check(res, { "health 200": (r) => r.status === 200 });
}

// ─── Main entry ──────────────────────────────────────────────────────────────
export default function () {
  // Always run a health check
  healthCheck();

  // Weighted distribution
  const roll = Math.random();
  if (roll < 0.40) {
    browsing();
  } else if (roll < 0.70) {
    studentSession();
  } else if (roll < 0.90) {
    bookingFlow();
  } else {
    ownerSession();
  }
}

// ─── Setup / teardown ────────────────────────────────────────────────────────
export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration?.values?.["p(95)"] || 0;
  const errRate = data.metrics.errors?.values?.rate || 0;

  console.log("\n─── Load Test Summary ───");
  console.log(`P95 response time : ${p95.toFixed(0)}ms  (threshold: <800ms) ${p95 < 800 ? "✅" : "❌"}`);
  console.log(`Error rate        : ${(errRate * 100).toFixed(2)}%  (threshold: <1%)   ${errRate < 0.01 ? "✅" : "❌"}`);
  console.log(`Total requests    : ${data.metrics.http_reqs?.values?.count || 0}`);

  return {
    "stdout": JSON.stringify(data, null, 2),
  };
}
