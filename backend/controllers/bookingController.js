const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a new booking and Razorpay order
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, basePrice, seats, showtimeDate, showtimeTime } = req.body;
    let amountPaid = 0;
    seats.forEach((seat) => {
      if (seat.startsWith("D") || seat.startsWith("E")) {
        amountPaid += basePrice * 1.5;
      } else {
        amountPaid += basePrice;
      }
    });
    const order = await razorpay.orders.create({
      amount: Math.round(amountPaid * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { movieId: movieId.toString(), seats: seats.join(",") },
    });
    const booking = await Booking.create({
      user: req.user._id,
      movieId: movieId.toString(),
      movieTitle,
      moviePoster,
      seats,
      amountPaid,
      stripeSessionId: order.id,
      showtimeDate,
      showtimeTime,
      paymentStatus: "pending",
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment signature and confirm booking
// @route   POST /api/bookings/verify
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify HMAC-SHA256 signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Find and mark booking as paid
    const booking = await Booking.findOne({ stripeSessionId: razorpay_order_id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    await booking.save();

    res.status(200).json({ message: "Payment verified successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user-scoped bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings/all
// @access  Private + Admin
const getAllGlobalBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  confirmPayment,
  getBookings,
  getAllGlobalBookings,
};
