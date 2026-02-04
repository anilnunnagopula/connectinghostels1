const mongoose = require("mongoose");

const dueSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      index: true,
    },
    title: {
      type: String, // e.g., "Rent - August 2025"
      required: true,
    },
    type: {
      type: String,
      enum: ["RENT", "DEPOSIT", "MAINTENANCE", "FINE", "OTHER", "UTILITIES"],
      required: true,
      default: "RENT",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID", "OVERDUE", "WAIVED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    fineAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remarks: {
      type: String,
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    }]
  },
  { timestamps: true }
);

// Virtual for total payable amount (amount + fine)
dueSchema.virtual('totalAmount').get(function() {
    return this.amount + this.fineAmount;
});

// Virtual for remaining amount
dueSchema.virtual('remainingAmount').get(function() {
    return (this.amount + this.fineAmount) - this.paidAmount;
});

module.exports = mongoose.model("Due", dueSchema);
