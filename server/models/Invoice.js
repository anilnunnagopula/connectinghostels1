const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      unique: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
        required: true
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true, // Format: HOSTEL-YYYY-TIMESTAMP
      index: true,
    },
    amount: {
        type: Number,
        required: true
    },
    items: [{
        description: String,
        amount: Number
    }],
    dateIssued: {
        type: Date,
        default: Date.now
    },
    pdfUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
