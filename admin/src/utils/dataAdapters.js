// admin/src/utils/dataAdapters.js

export const normalizeBookingData = (b) => {
  if (!b) return null;
  const id = b._id || b.id || b.bookingId || "";

  // Extract deeply nested movie details depending on exactly how it drifted
  const movieId = b.movieId || (b.movie && b.movie._id) || "";
  const movieTitle = b.movieTitle || (b.movie && (b.movie.title || b.movie.movieName)) || b.movieName || (typeof b.movie === "string" ? b.movie : "Unknown Movie");

  // Fix: Our schema separated showtimeDate and showtimeTime
  const rawSlot = b.showtimeDate ? `${b.showtimeDate}T${b.showtimeTime || "00:00:00"}` : (b.showtime || b.slot || b.time || b.date);
  const slotDate = rawSlot ? new Date(rawSlot) : null;

  // Flatten mixed seat arrays
  let seats = [];
  if (Array.isArray(b.seats)) {
    seats = b.seats.map((s) => typeof s === "string" ? s : (s?.seatId || s?.id || "")).filter(Boolean);
  } else if (Array.isArray(b.seatIds)) {
    seats = b.seatIds.map(String).filter(Boolean);
  }

  // Flatten the populated Mongoose user sub-document
  const customer = b.customer || b.customerName || (b.user && (b.user.name || b.user.fullName || b.user.email)) || "Guest";

  // Capture total payments robustly against nested object vs explicit paise
  let amountRupees = 0;
  if (b.amountPaid !== undefined) amountRupees = b.amountPaid;
  else if (b.amountPaise !== undefined && b.amountPaise !== null) amountRupees = Number(b.amountPaise) / 100;
  else if (typeof b.amount === "number") amountRupees = b.amount;
  else if (b.totalPaid !== undefined) amountRupees = b.totalPaid;

  const status = (b.status || "").toString().toLowerCase();
  const paymentStatus = (b.paymentStatus || "").toString().toLowerCase();
  const auditorium = b.auditorium || b.audi || "Audi 1";

  return { 
    id, 
    movieId, 
    movieTitle, 
    slot: slotDate, 
    seats, 
    customer, 
    amount: amountRupees, 
    totalPaid: amountRupees, // explicitly map totalPaid to identical generic
    status, 
    paymentStatus, 
    auditorium, 
    raw: b 
  };
};
