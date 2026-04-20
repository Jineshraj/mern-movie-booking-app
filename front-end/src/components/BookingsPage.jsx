import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import {
  bookingsPageStyles,
  formatTime,
  formatDuration,
} from "../assets/dummyStyles";
import {
  Film,
  Clock,
  MapPin,
  QrCode,
  ChevronDown,
  X,
} from "lucide-react";
import movies from "../assets/dummymdata";

// ── Helper: derive row type from seat ID first letter ─────────────────────────
const RECLINER_ROWS = ["D", "E"];
const getSeatType = (seatId) =>
  RECLINER_ROWS.includes(seatId?.[0]?.toUpperCase()) ? "recliner" : "standard";

// ── Main Component ─────────────────────────────────────────────────────────────
const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [qrModal, setQrModal] = useState(null); // holds booking object for modal

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("cine_token");
        if (!token) return;
        
        const { data } = await axios.get("http://localhost:5000/api/bookings/mybookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // The backend sends them sorted, just format to match UI expected keys
        const formattedBookings = data.map(b => ({
          bookingId: b._id.slice(-8).toUpperCase(),
          movie: b.movieTitle || "Unknown Movie",
          poster: b.moviePoster || "",
          showtime: new Date(b.createdAt), // Use creation time for simple display
          audi: "Audi 1",
          totalSeats: b.seats?.length || 0,
          totalAmount: b.amountPaid || 0,
          bookedSeats: b.seats || [],
          bookingTime: b.createdAt
        }));
        
        setBookings(formattedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);



  const toggleExpand = (bookingId) =>
    setExpandedId((prev) => (prev === bookingId ? null : bookingId));

  if (loading) {
    return (
      <div className={bookingsPageStyles.pageContainer}>
        <div className={bookingsPageStyles.mainContainer}>
          <p className={bookingsPageStyles.loading}>Loading your tickets…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={bookingsPageStyles.pageContainer}>
      <div className={bookingsPageStyles.mainContainer}>
        {/* Header */}
        <div className={bookingsPageStyles.header}>
          <div>
            <h1 className={bookingsPageStyles.title}>My Bookings</h1>
            <p className={bookingsPageStyles.subtitle}>
              {bookings.length} ticket{bookings.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className={bookingsPageStyles.grid}>
          {bookings.length === 0 ? (
            <div className={bookingsPageStyles.noBookings}>
              No bookings yet. Book a movie to see your tickets here!
            </div>
          ) : (
            bookings.map((booking) => {
              const poster = booking.poster;
              const isExpanded = expandedId === booking.bookingId;
              const qrValue = JSON.stringify({
                bookingId: booking.bookingId,
                movie: booking.movie,
                seats: booking.bookedSeats,
                showtime: booking.showtime,
                total: booking.totalAmount,
              });

              return (
                <div key={booking.bookingId} className={bookingsPageStyles.bookingCard}>
                  <div className={bookingsPageStyles.cardContent}>
                    {/* Poster */}
                    {poster && (
                      <div className={bookingsPageStyles.posterContainer}>
                        <img
                          src={poster}
                          alt={booking.movie}
                          className={bookingsPageStyles.poster}
                        />
                      </div>
                    )}

                    <div className={bookingsPageStyles.cardInfo}>
                      {/* Title row */}
                      <div className={bookingsPageStyles.cardHeader}>
                        <div>
                          <div className={bookingsPageStyles.movieTitle}>
                            <Film className={bookingsPageStyles.movieIcon} />
                            {booking.movie}
                          </div>
                          <div className={bookingsPageStyles.bookingId}>
                            Booking ID:{" "}
                            <span className={bookingsPageStyles.bookingIdText}>
                              {booking.bookingId}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Showtime + Audi */}
                      <div className={bookingsPageStyles.details}>
                        <div className={bookingsPageStyles.timeContainer}>
                          <Clock className={bookingsPageStyles.timeIcon} />
                          {formatTime(booking.showtime)}
                        </div>
                        {booking.audi && (
                          <div className={bookingsPageStyles.locationContainer}>
                            <MapPin className={bookingsPageStyles.locationIcon} />
                            <span className={bookingsPageStyles.locationText}>
                              {booking.audi}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Summary row */}
                      <div className={bookingsPageStyles.summary}>
                        <span className={bookingsPageStyles.seatsLabel}>
                          {booking.totalSeats} seat(s)
                        </span>
                        <span className={bookingsPageStyles.total}>
                          ₹{booking.totalAmount}
                        </span>
                      </div>

                      {/* Toggle + QR row */}
                      <div className={bookingsPageStyles.toggleButton}>
                        <button
                          onClick={() => toggleExpand(booking.bookingId)}
                          className={bookingsPageStyles.detailsButton}
                        >
                          <ChevronDown
                            className={`${bookingsPageStyles.chevron} ${
                              isExpanded
                                ? bookingsPageStyles.chevronOpen
                                : bookingsPageStyles.chevronClosed
                            }`}
                          />
                          {isExpanded ? "Hide Details" : "View Details"}
                        </button>

                        {/* QR code thumbnail — click to open modal */}
                        <div
                          className={bookingsPageStyles.qrSection}
                          onClick={() => setQrModal({ booking, qrValue })}
                        >
                          <QRCodeSVG
                            value={qrValue}
                            size={64}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="M"
                            className={bookingsPageStyles.qrImage}
                          />
                        </div>
                      </div>

                      {/* Expanded details section */}
                      <div
                        className={`${bookingsPageStyles.expandedDetails} ${
                          isExpanded
                            ? bookingsPageStyles.expandedOpen
                            : bookingsPageStyles.expandedClosed
                        }`}
                      >
                        {/* Seat breakdown */}
                        <div className={bookingsPageStyles.seatsSection}>
                          <div className={bookingsPageStyles.seatsLabelExpanded}>
                            Seats Booked:
                          </div>
                          <div className={bookingsPageStyles.seatsContainer}>
                            {(booking.bookedSeats || []).map((seat) => {
                              const type = getSeatType(seat);
                              return (
                                <div
                                  key={seat}
                                  className={bookingsPageStyles.seatItem}
                                >
                                  <span className={bookingsPageStyles.seatId}>
                                    {seat}
                                  </span>
                                  <span
                                    className={`${bookingsPageStyles.seatType} ${
                                      type === "recliner"
                                        ? bookingsPageStyles.seatTypeRecliner
                                        : bookingsPageStyles.seatTypeStandard
                                    }`}
                                  >
                                    {type}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Pricing breakdown */}
                        <div className={bookingsPageStyles.pricing}>
                          <div className={bookingsPageStyles.finalTotal}>
                            <span>Total Paid</span>
                            <span>₹{booking.totalAmount}</span>
                          </div>
                        </div>

                        {/* Booking timestamp */}
                        {booking.bookingTime && (
                          <div className={bookingsPageStyles.durationLabel}>
                            Booked on:{" "}
                            <span className={bookingsPageStyles.duration}>
                              {new Date(booking.bookingTime).toLocaleString(
                                "en-IN",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div
          className={bookingsPageStyles.modalOverlay}
          onClick={() => setQrModal(null)}
        >
          <div className={bookingsPageStyles.modalBackdrop} />
          <div
            className={bookingsPageStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={bookingsPageStyles.modalHeader}>
              <div>
                <div className={bookingsPageStyles.modalTitle}>
                  <Film size={16} className="inline mr-2" />
                  {qrModal.booking.movie}
                </div>
                <div className={bookingsPageStyles.modalBookingId}>
                  ID:{" "}
                  <span className={bookingsPageStyles.modalIdText}>
                    {qrModal.booking.bookingId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setQrModal(null)}
                className={bookingsPageStyles.modalCloseButton}
              >
                <X className={bookingsPageStyles.modalCloseIcon} />
              </button>
            </div>

            <div className={bookingsPageStyles.modalDetails}>
              <p>
                <Clock size={14} className="inline mr-1 text-red-300" />
                {formatTime(qrModal.booking.showtime)}
              </p>
              {qrModal.booking.audi && (
                <p>
                  <MapPin size={14} className="inline mr-1 text-red-300" />
                  {qrModal.booking.audi}
                </p>
              )}
              <p className="mt-2">
                Seats:{" "}
                <strong>{(qrModal.booking.bookedSeats || []).join(", ")}</strong>
              </p>
              <p>
                Total: <strong>₹{qrModal.booking.totalAmount}</strong>
              </p>
            </div>

            {/* Large scannable QR */}
            <div className="flex justify-center mt-4">
              <QRCodeSVG
                value={qrModal.qrValue}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                className="rounded-lg"
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              Show this QR at the counter
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
