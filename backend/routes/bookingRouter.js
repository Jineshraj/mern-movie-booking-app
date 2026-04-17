const express = require("express");
const router = express.Router();
const {
  createBooking,
  confirmPayment,
  getBookings,
  getAllGlobalBookings,
} = require("../controllers/bookingController");
const { protect, adminProtect } = require("../middleware/auth");

router.post("/", protect, createBooking);
router.post("/verify", protect, confirmPayment);
router.get("/mybookings", protect, getBookings);
router.get("/all", protect, adminProtect, getAllGlobalBookings);

module.exports = router;
