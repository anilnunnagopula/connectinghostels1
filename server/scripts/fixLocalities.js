/**
 * fixLocalities.js — One-time migration script
 *
 * Detects locality from the hostel's address field and updates
 * all hostels that currently have locality = "Other".
 *
 * Usage:
 *   node server/scripts/fixLocalities.js
 *
 * Run from the project root (so .env is found).
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Hostel = require("../models/Hostel");

const KEYWORD_MAP = [
  { keywords: ["mangalpally"], locality: "Mangalpally" },
  { keywords: ["ibrahimpatnam", "ibrahim patnam"], locality: "Ibrahimpatnam" },
  { keywords: ["sheriguda"], locality: "Sheriguda" },
];

function detectLocality(address = "") {
  const lower = address.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.locality;
    }
  }
  return null; // cannot auto-detect
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const hostels = await Hostel.find({}).select("name address locality");
  console.log(`\nFound ${hostels.length} total hostels\n`);

  let updated = 0;
  let skipped = 0;

  for (const hostel of hostels) {
    const detected = detectLocality(hostel.address);

    if (!detected) {
      console.log(`  SKIP  "${hostel.name}" — address: "${hostel.address}" (cannot auto-detect, stays "${hostel.locality}")`);
      skipped++;
      continue;
    }

    if (hostel.locality === detected) {
      console.log(`  OK    "${hostel.name}" — already "${detected}"`);
      continue;
    }

    await Hostel.updateOne({ _id: hostel._id }, { $set: { locality: detected } });
    console.log(`  FIXED "${hostel.name}" — "${hostel.locality}" → "${detected}"  (address: "${hostel.address}")`);
    updated++;
  }

  console.log(`\nDone. ${updated} updated, ${skipped} could not be auto-detected (left as-is).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
