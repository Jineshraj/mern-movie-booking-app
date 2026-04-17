const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @desc    Create a new booking and stripe checkout session
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { movieId, seats, showtimeDate, showtimeTime } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Re-verify Total on Server to perfectly secure against front-end manipulation
    let amountPaid = 0;
    seats.forEach((seat) => {
      if (seat.startsWith("D") || seat.startsWith("E")) {
        amountPaid += movie.basePrice * 1.5;
      } else {
        amountPaid += movie.basePrice;
      }
    });

    // Mock Stripe Implementation (For Local Testing without real API keys)
    const mockedSessionId = `cs_test_${Math.random().toString(36).substring(7)}`;

    // Create Booking Document as "Pending" (Since payment hasn't processed)
    const booking = await Booking.create({
      user: req.user._id,
      movie: movieId,
      seats,
      amountPaid,
      stripeSessionId: mockedSessionId,
      showtimeDate,
      showtimeTime,
      paymentStatus: "pending",
    });

    // We would return the actual Stripe checkout URL here. We return a local verification route instead.
    res.status(201).json({
      checkoutUrl: `/verify-payment?session_id=${mockedSessionId}`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm payment web-hook fallback explicitly verifying stripe session
// @route   POST /api/bookings/verify
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.body;
    
    // In production we hit stripe.checkout.sessions.retrieve(session_id)
    const booking = await Booking.findOne({ stripeSessionId: session_id });

    if (!booking) {
      return res.status(404).json({ message: "Invalid session" });
    }

    // Update booking to paid
    booking.paymentStatus = "paid";
    await booking.save();

    // Loop through the movie showtimes and permanently lock the physical seats into the array
    const movie = await Movie.findById(booking.movie);
    const showtimeIndex = movie.showtimes.findIndex(
      (s) =>
        s.date.toISOString() === booking.showtimeDate.toISOString() &&
        s.time === booking.showtimeTime
    );

    if (showtimeIndex !== -1) {
      movie.showtimes[showtimeIndex].bookedSeats.push(...booking.seats);
      await movie.save();
    }

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user-scoped bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    // We restrict queries directly through `req.user.id` so a hacker cannot read others arrays
    const bookings = await Booking.find({ user: req.user._id })
      .populate("movie", "title posterUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllGlobalBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("movie", "title")
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
