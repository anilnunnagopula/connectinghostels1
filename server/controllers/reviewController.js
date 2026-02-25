const Review = require("../models/Review");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const logger = require("../middleware/logger");

/**
 * POST /api/reviews
 * Create or update a review. Only students who currently live or have lived
 * in the hostel (currentHostel matches) can review.
 */
exports.createReview = async (req, res) => {
  const { hostelId, rating, comment } = req.body;

  if (!hostelId || !rating) {
    return res.status(400).json({ error: "hostelId and rating are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const student = await Student.findOne({ user: req.user.id });
  if (!student) {
    return res.status(404).json({ error: "Student profile not found" });
  }

  // Guard: student must have been admitted to this hostel
  const hostelObjId = student.currentHostel?.toString();
  if (hostelObjId !== hostelId) {
    return res.status(403).json({
      error: "You can only review a hostel you are or were admitted to",
    });
  }

  // Upsert — one review per student per hostel
  const review = await Review.findOneAndUpdate(
    { hostel: hostelId, student: student._id },
    { rating, comment: comment?.trim() || "" },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  logger.info(`Review upserted: studentId=${student._id} hostelId=${hostelId} rating=${rating}`);

  res.status(200).json({ message: "Review saved", review });
};

/**
 * GET /api/reviews/hostel/:hostelId?page=1&limit=10
 * Public: paginated reviews for a hostel with average rating.
 */
exports.getHostelReviews = async (req, res) => {
  const { hostelId } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const [reviews, total, stats] = await Promise.all([
    Review.find({ hostel: hostelId })
      .populate("student", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ hostel: hostelId }),
    Review.aggregate([
      { $match: { hostel: require("mongoose").Types.ObjectId.createFromHexString(hostelId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]),
  ]);

  const avgRating = stats[0] ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  const ratingCount = stats[0]?.count || 0;

  res.json({
    reviews,
    avgRating,
    ratingCount,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

/**
 * PUT /api/reviews/:id/reply
 * Owner replies to a review on their hostel.
 */
exports.replyToReview = async (req, res) => {
  const { reply } = req.body;
  if (!reply?.trim()) {
    return res.status(400).json({ error: "Reply text is required" });
  }

  const review = await Review.findById(req.params.id).populate("hostel", "ownerId");
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  if (review.hostel.ownerId?.toString() !== req.user.id) {
    return res.status(403).json({ error: "You can only reply to reviews on your own hostels" });
  }

  review.ownerReply = reply.trim();
  review.repliedAt = new Date();
  await review.save();

  logger.info(`Owner replied to review ${review._id}`);
  res.json({ message: "Reply added", review });
};

/**
 * DELETE /api/reviews/:id
 * Admin-only: hard-delete a review.
 */
exports.deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  logger.info(`Admin ${req.user.email} deleted review ${req.params.id}`);
  res.json({ message: "Review deleted" });
};
