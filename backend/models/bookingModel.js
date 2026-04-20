const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    movieTitle: { type: String, required: true },
    moviePoster: { type: String, required: true },
    movieId: { type: String, required: true }, // Store dummy integer as string
    seats: [{ type: String, required: true }],
    amountPaid: { type: Number, required: true },
    stripeSessionId: { type: String },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed"],
    },
    showtimeDate: { type: Date, required: true },
    showtimeTime: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
