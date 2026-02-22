/**
 * storageAdapter.js — Multer storage abstraction
 *
 * Uses Cloudflare R2 (S3-compatible) when R2 env vars are present.
 * Falls back to local disk storage transparently — no code changes needed
 * in the routes or controllers when switching between the two.
 *
 * Required env vars for R2:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *   R2_PUBLIC_URL  (e.g. https://pub-xxx.r2.dev  — your bucket's public URL)
 */

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const R2_CONFIGURED =
  !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );

let s3Client = null;
let multerS3 = null;

if (R2_CONFIGURED) {
  try {
    const { S3Client } = require("@aws-sdk/client-s3");
    multerS3 = require("multer-s3");
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  } catch (err) {
    // @aws-sdk/client-s3 or multer-s3 not installed — fall back to disk
    s3Client = null;
    multerS3 = null;
  }
}

/**
 * Returns a multer storage engine for the given destination.
 *
 * @param {string} dest   - Local disk folder (e.g. "uploads/", "uploads/complaints/")
 * @param {string} prefix - Key prefix inside the R2 bucket (e.g. "hostel-images/")
 */
const getStorage = (dest = "uploads/", prefix = "") => {
  const randomName = (file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomUUID() + ext);
  };

  if (R2_CONFIGURED && s3Client && multerS3) {
    return multerS3({
      s3: s3Client,
      bucket: process.env.R2_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${prefix}${crypto.randomUUID()}${ext}`);
      },
    });
  }

  // Local disk fallback
  return multer.diskStorage({
    destination: dest,
    filename: (req, file, cb) => randomName(file, cb),
  });
};

/**
 * Extracts the file URL/path from a multer file object.
 * Works with both disk storage (file.path) and S3/R2 (file.location).
 */
const getFilePath = (file) => file.location || file.path;

module.exports = { getStorage, getFilePath, R2_CONFIGURED };
