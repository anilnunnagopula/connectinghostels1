/**
 * migrateToR2.js — One-time migration: local /uploads → Cloudflare R2
 *
 * Usage:
 *   cd server
 *   node scripts/migrateToR2.js [--dry-run]
 *
 * What it does:
 *   1. Connects to MongoDB
 *   2. Finds all Hostel documents with local image paths (/uploads/...)
 *   3. Uploads each file to Cloudflare R2
 *   4. Updates the Hostel document with the new R2 public URL
 *   5. Finds all Complaint documents with local attachment paths and migrates them too
 *
 * Prerequisites:
 *   - server/.env must have all R2_* and MONGO_URI variables set
 *   - R2 bucket must already exist
 *   - Files must exist at the paths stored in the database
 *
 * Dry-run mode: pass --dry-run to preview changes without writing to DB or R2.
 */

require("dotenv").config();

const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { S3Client, PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");

const Hostel = require("../models/Hostel");
const Complaint = require("../models/Complaint");

// ============================================================================
// CONFIGURATION
// ============================================================================

const DRY_RUN = process.argv.includes("--dry-run");

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
  MONGO_URI,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
  console.error("❌ Missing R2 environment variables. Check your .env file.");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI. Check your .env file.");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Uploads root on disk
const UPLOADS_ROOT = path.join(__dirname, "..", "uploads");

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Returns true if the path looks like a local /uploads/... path.
 * R2 URLs (http/https) are already migrated.
 */
function isLocalPath(filePath) {
  if (!filePath) return false;
  return !filePath.startsWith("http://") && !filePath.startsWith("https://");
}

/**
 * Derives the R2 object key from a local file path.
 * e.g. /uploads/hostel-images/abc.jpg → hostel-images/abc.jpg
 */
function localPathToR2Key(filePath) {
  // Normalize backslashes
  const normalized = filePath.replace(/\\/g, "/");
  // Strip leading slash or "uploads/"
  return normalized.replace(/^\/?(uploads\/)?/, "");
}

/**
 * Resolve the absolute disk path for a stored path.
 * Handles both /uploads/foo.jpg and uploads/foo.jpg
 */
function resolveAbsPath(filePath) {
  const normalized = filePath.replace(/\\/g, "/").replace(/^\/?(uploads\/)?/, "");
  return path.join(UPLOADS_ROOT, normalized);
}

/**
 * Check if an R2 key already exists (avoid re-uploading).
 */
async function r2KeyExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Upload a single file to R2. Returns the public URL.
 */
async function uploadToR2(absPath, r2Key) {
  const contentType = mime.lookup(absPath) || "application/octet-stream";
  const fileContent = fs.readFileSync(absPath);

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileContent,
      ContentType: contentType,
    }),
  );

  return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${r2Key}`;
}

// ============================================================================
// MIGRATION LOGIC
// ============================================================================

let stats = { hostelsScanned: 0, imagesUploaded: 0, imagesSkipped: 0, imagesMissing: 0, hostelsSaved: 0, complaintsScanned: 0, attachmentsUploaded: 0, complaintsSaved: 0, errors: 0 };

async function migrateHostelImages() {
  console.log("\n📦 Migrating hostel images...");

  // Bypass soft-delete pre-query hook to include all hostels
  const hostels = await Hostel.find({ isDeleted: { $in: [true, false, null, undefined] } }).select("name images");

  stats.hostelsScanned = hostels.length;
  console.log(`   Found ${hostels.length} hostels to check`);

  for (const hostel of hostels) {
    if (!hostel.images || hostel.images.length === 0) continue;

    let changed = false;
    const newImages = [];

    for (const imgPath of hostel.images) {
      if (!isLocalPath(imgPath)) {
        newImages.push(imgPath); // Already R2 URL
        stats.imagesSkipped++;
        continue;
      }

      const absPath = resolveAbsPath(imgPath);
      const r2Key = localPathToR2Key(imgPath);

      if (!fs.existsSync(absPath)) {
        console.warn(`   ⚠️  File missing: ${absPath} (hostel: ${hostel.name})`);
        newImages.push(imgPath); // Keep old path, don't lose the reference
        stats.imagesMissing++;
        continue;
      }

      const r2Url = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${r2Key}`;

      if (DRY_RUN) {
        console.log(`   [DRY RUN] Would upload ${absPath} → ${r2Key}`);
        newImages.push(r2Url);
        stats.imagesUploaded++;
        changed = true;
        continue;
      }

      try {
        const alreadyExists = await r2KeyExists(r2Key);
        if (!alreadyExists) {
          await uploadToR2(absPath, r2Key);
          console.log(`   ✅ Uploaded: ${r2Key}`);
        } else {
          console.log(`   ⏭️  Already in R2: ${r2Key}`);
        }
        newImages.push(r2Url);
        stats.imagesUploaded++;
        changed = true;
      } catch (err) {
        console.error(`   ❌ Failed to upload ${r2Key}: ${err.message}`);
        newImages.push(imgPath); // Keep old path on failure
        stats.errors++;
      }
    }

    if (changed) {
      if (!DRY_RUN) {
        hostel.images = newImages;
        await hostel.save();
        stats.hostelsSaved++;
        console.log(`   💾 Hostel "${hostel.name}" updated`);
      } else {
        console.log(`   [DRY RUN] Would update hostel "${hostel.name}"`);
      }
    }
  }
}

async function migrateComplaintAttachments() {
  console.log("\n📎 Migrating complaint attachments...");

  const complaints = await Complaint.find({ "attachments.0": { $exists: true } }).select("attachments");

  stats.complaintsScanned = complaints.length;
  console.log(`   Found ${complaints.length} complaints with attachments`);

  for (const complaint of complaints) {
    let changed = false;

    for (const attachment of complaint.attachments) {
      if (!isLocalPath(attachment.path)) {
        stats.imagesSkipped++;
        continue;
      }

      const absPath = resolveAbsPath(attachment.path);
      const r2Key = localPathToR2Key(attachment.path);

      if (!fs.existsSync(absPath)) {
        console.warn(`   ⚠️  Attachment missing: ${absPath}`);
        stats.imagesMissing++;
        continue;
      }

      const r2Url = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${r2Key}`;

      if (DRY_RUN) {
        console.log(`   [DRY RUN] Would upload attachment ${r2Key}`);
        attachment.path = r2Url;
        stats.attachmentsUploaded++;
        changed = true;
        continue;
      }

      try {
        const alreadyExists = await r2KeyExists(r2Key);
        if (!alreadyExists) {
          await uploadToR2(absPath, r2Key);
          console.log(`   ✅ Uploaded attachment: ${r2Key}`);
        } else {
          console.log(`   ⏭️  Already in R2: ${r2Key}`);
        }
        attachment.path = r2Url;
        stats.attachmentsUploaded++;
        changed = true;
      } catch (err) {
        console.error(`   ❌ Failed to upload attachment ${r2Key}: ${err.message}`);
        stats.errors++;
      }
    }

    if (changed) {
      if (!DRY_RUN) {
        complaint.markModified("attachments");
        await complaint.save();
        stats.complaintsSaved++;
      }
    }
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`\n🚀 R2 Migration Script${DRY_RUN ? " [DRY RUN — no changes will be written]" : ""}`);
  console.log(`   Target bucket: ${R2_BUCKET_NAME}`);
  console.log(`   Public URL:    ${R2_PUBLIC_URL}`);

  await mongoose.connect(MONGO_URI, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000 });
  console.log("✅ MongoDB connected");

  await migrateHostelImages();
  await migrateComplaintAttachments();

  console.log("\n📊 Migration Summary:");
  console.log(`   Hostels scanned:       ${stats.hostelsScanned}`);
  console.log(`   Images uploaded:       ${stats.imagesUploaded}`);
  console.log(`   Images skipped (R2):   ${stats.imagesSkipped}`);
  console.log(`   Images missing:        ${stats.imagesMissing}`);
  console.log(`   Hostels DB updated:    ${stats.hostelsSaved}`);
  console.log(`   Complaints scanned:    ${stats.complaintsScanned}`);
  console.log(`   Attachments uploaded:  ${stats.attachmentsUploaded}`);
  console.log(`   Complaints DB updated: ${stats.complaintsSaved}`);
  console.log(`   Errors:                ${stats.errors}`);

  if (stats.errors > 0) {
    console.warn("\n⚠️  Some files failed to upload. Check errors above and re-run.");
  } else {
    console.log("\n✅ Migration complete!");
  }

  await mongoose.disconnect();
  process.exit(stats.errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
