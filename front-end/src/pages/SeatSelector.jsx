import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ChevronLeft, Sofa, RockingChair, Tag } from "lucide-react";
import { seatSelectorStyles } from "../assets/dummyStyles";
import movies from "../assets/dummymdata";

// ── Repo snippet: ROW definition ───────────────────────────────────────────────
const ROWS = [
  { id: "A", type: "standard", count: 8 },
  { id: "B", type: "standard", count: 8 },
  { id: "C", type: "standard", count: 8 },
  { id: "D", type: "recliner", count: 8 },
  { id: "E", type: "recliner", count: 8 },
];

const seatId = (r, n) => `${r}${n}`;

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SeatSelector() {
  const { id, slot } = useParams();
  const movieId = Number(id);
  const slotKey = slot ? decodeURIComponent(slot) : "";
  const navigate = useNavigate();

  const movie = useMemo(() => movies.find((m) => m.id === movieId), [movieId]);

  // Repo snippet: storageKey from movieId + slotKey
  const storageKey = `bookings_${movieId}_${slotKey}`;

  // Repo snippet: booked / selected as Set state
  const [booked, setBooked] = useState(new Set());
  const [selected, setSelected] = useState(new Set());

  // Repo snippet: showtime validation guard useEffect
  useEffect(() => {
    const isValidDate = !!slotKey && !isNaN(new Date(slotKey).getTime());
    if (!isValidDate) {
      toast.error("Invalid or missing showtime. Please select a time from the movie page.");
      setTimeout(() => {
        if (movie) navigate(`/movie/${movie.id}`);
        else navigate("/movies");
      }, 600);
    }
  }, [slotKey, movie, navigate]);

  // Repo snippet: load booked seats from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const arr = JSON.parse(raw);
        setBooked(new Set(arr));
      } else {
        setBooked(new Set());
      }
    } catch {
      setBooked(new Set());
    }
    setSelected(new Set());
  }, [storageKey]);

  // Repo snippet: audiForSlot useMemo
  const audiForSlot = useMemo(() => {
    if (!movie || !slotKey) return null;
    try {
      const targetMs = new Date(slotKey).getTime();
      if (isNaN(targetMs)) return null;
      for (const s of movie.slots || []) {
        let timeStr = null;
        if (typeof s === "string") timeStr = s;
        else if (s.datetime) timeStr = s.datetime;
        else if (s.time) timeStr = s.time;
        else if (s.iso) timeStr = s.iso;
        else if (s.date) timeStr = s.date;
        if (!timeStr) continue;
        if (new Date(timeStr).getTime() === targetMs) {
          return s.audi || s.audiName || s.auditorium || null;
        }
      }
    } catch { /* ignore */ }
    return null;
  }, [movie, slotKey]);

  const toggleSeat = (id) => {
    if (booked.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Repo snippet: confirmBooking with full localStorage write
  const confirmBooking = () => {
    if (selected.size === 0) {
      toast.error("Select at least one seat.");
      return;
    }
    const newBooked = new Set([...booked, ...selected]);
    localStorage.setItem(storageKey, JSON.stringify([...newBooked]));

    const bookingDetails = {
      movie: movie?.title,
      movieId,
      showtime: slotKey,
      audi: audiForSlot || null,
      bookedSeats: [...selected].sort(),
      totalSeats: selected.size,
      totalAmount: Math.round(
        [...selected].reduce((sum, s) => {
          const rowLetter = s[0];
          const def = ROWS.find((r) => r.id === rowLetter);
          const multiplier = def?.type === "recliner" ? 1.5 : 1;
          return sum + (movie?.price ?? 0) * multiplier;
        }, 0)
      ),
      bookingTime: new Date().toISOString(),
      bookingId: `B${Date.now()}`,
    };

    // Persist the entire booking record to localStorage for Bookings page
    const existing = JSON.parse(localStorage.getItem("bookmovie_local_booking") || "[]");
    existing.push(bookingDetails);
    localStorage.setItem("bookmovie_local_booking", JSON.stringify(existing));

    console.log("🎬 Booking Confirmed:", bookingDetails);

    setBooked(newBooked);
    setSelected(new Set());

    toast.success(
      <div>
        <div className="font-bold">Booking Confirmed! 🎉</div>
        <div className="text-sm">{bookingDetails.totalSeats} seat(s) booked successfully</div>
      </div>
    );
  };

  // Pricing total
  const basePrice = movie?.price ?? 0;
  const total = [...selected].reduce((sum, s) => {
    const rowLetter = s[0];
    const def = ROWS.find((r) => r.id === rowLetter);
    return sum + basePrice * (def?.type === "recliner" ? 1.5 : 1);
  }, 0);

  const selectedCount = selected.size;

  return (
    <div className={seatSelectorStyles.pageContainer}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <style>{seatSelectorStyles.customCSS}</style>

      <div className={seatSelectorStyles.mainContainer}>
        {/* Header */}
        <div className={seatSelectorStyles.headerContainer}>
          <Link to={`/movie/${movieId}`} className={seatSelectorStyles.backButton}>
            <ChevronLeft className={seatSelectorStyles.backButtonIcon} size={24} />
            Back
          </Link>
          <div className={seatSelectorStyles.titleContainer}>
            <h1 className={seatSelectorStyles.movieTitle}>{movie?.title || "Select Seats"}</h1>
            {/* Repo snippet: showtime text with IST locale */}
            <div className={seatSelectorStyles.showtimeText}>
              {slotKey
                ? new Date(slotKey).toLocaleString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Showtime unavailable"}
            </div>
          </div>
          {/* Repo snippet: audiForSlot badge */}
          {audiForSlot && (
            <div style={{
              background: "linear-gradient(90deg,#ef4444,#dc2626)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}>
              {audiForSlot}
            </div>
          )}
        </div>

        {/* Screen */}
        <div className={seatSelectorStyles.screenContainer}>
          <div
            className={seatSelectorStyles.screen}
            style={{ transform: "perspective(120px) rotateX(6deg)", maxWidth: 900, boxShadow: "0 0 40px rgba(220,38,38,0.18)" }}
          >
            <div className={seatSelectorStyles.screenText}>SCREEN</div>
            <div className={seatSelectorStyles.screenSubtext}>All eyes this way</div>
          </div>
        </div>

        {/* Main content */}
        <div className={seatSelectorStyles.mainContent}>
          <div className={seatSelectorStyles.sectionHeader}>
            <div className={seatSelectorStyles.sectionTitleContainer}>
              <h2 className={seatSelectorStyles.sectionTitle}>Choose Your Seats</h2>
              <div className={seatSelectorStyles.titleDivider}></div>
            </div>
          </div>

          {/* Repo snippet: Seat Grid with class logic */}
          <div className={seatSelectorStyles.seatGridContainer}>
            {ROWS.map((row) => (
              <div key={row.id} className={seatSelectorStyles.rowContainer}>
                <div className={seatSelectorStyles.rowHeader}>
                  <span className={seatSelectorStyles.rowLabel}>{row.id}</span>
                  <div className={seatSelectorStyles.seatGrid}>
                    {Array.from({ length: row.count }).map((_, i) => {
                      const num = i + 1;
                      const sid = seatId(row.id, num);
                      const isBooked = booked.has(sid);
                      const isSelected = selected.has(sid);

                      // Repo snippet: seat button class logic
                      let cls = seatSelectorStyles.seatButton;
                      if (isBooked)
                        cls += ` ${seatSelectorStyles.seatButtonBooked}`;
                      else if (isSelected)
                        cls += row.type === "recliner"
                          ? ` ${seatSelectorStyles.seatButtonSelectedRecliner}`
                          : ` ${seatSelectorStyles.seatButtonSelectedStandard}`;
                      else
                        cls += row.type === "recliner"
                          ? ` ${seatSelectorStyles.seatButtonAvailableRecliner}`
                          : ` ${seatSelectorStyles.seatButtonAvailableStandard}`;

                      return (
                        <button
                          key={sid}
                          onClick={() => toggleSeat(sid)}
                          disabled={isBooked}
                          className={cls}
                          title={
                            isBooked
                              ? `Seat ${sid} - Already Booked`
                              : `Seat ${sid} (${row.type}) - ₹${row.type === "recliner" ? Math.round(basePrice * 1.5) : basePrice}`
                          }
                        >
                          <div className={seatSelectorStyles.seatContent}>
                            {row.type === "recliner" ? (
                              <Sofa size={16} className={seatSelectorStyles.seatIcon} />
                            ) : (
                              <RockingChair size={12} className={seatSelectorStyles.seatIcon} />
                            )}
                            <div className={seatSelectorStyles.seatNumber}>{num}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <span className={seatSelectorStyles.rowType}>{row.type}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Repo snippet: selected seat badges & total */}
          <div className={seatSelectorStyles.summaryGrid}>
            <div className={seatSelectorStyles.summaryContainer}>
              <h3 className={seatSelectorStyles.summaryTitle}>
                <Tag size={18} /> Booking Summary
              </h3>
              {selectedCount > 0 ? (
                <>
                  {/* Repo snippet: selected seats badges JSX */}
                  <div className={seatSelectorStyles.selectedSeatsContainer}>
                    <div className={seatSelectorStyles.selectedSeatsLabel}>Selected Seats:</div>
                    <div className={seatSelectorStyles.selectedSeatsList}>
                      {[...selected].sort().map((seat) => (
                        <span key={seat} className={seatSelectorStyles.selectedSeatBadge}>{seat}</span>
                      ))}
                    </div>
                  </div>
                  <div className={seatSelectorStyles.totalContainer}>
                    <div className={seatSelectorStyles.pricingRow}>
                      <span className={seatSelectorStyles.totalLabel}>Total Amount:</span>
                      <span className={seatSelectorStyles.totalValue}>₹{Math.round(total)}</span>
                    </div>
                  </div>
                  <div className={seatSelectorStyles.actionButtons}>
                    <button
                      onClick={() => setSelected(new Set())}
                      className={seatSelectorStyles.clearButton}
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={confirmBooking}
                      className={seatSelectorStyles.confirmButton}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </>
              ) : (
                <div className={seatSelectorStyles.emptyState}>
                  <div className={seatSelectorStyles.emptyStateTitle}>No seats selected</div>
                  <div className={seatSelectorStyles.emptyStateSubtitle}>Click on a seat above to select it</div>
                </div>
              )}
            </div>

            {/* Pricing info panel */}
            <div className={seatSelectorStyles.pricingContainer}>
              <h3 className={seatSelectorStyles.pricingTitle}>
                <Tag size={18} /> Pricing
              </h3>
              <div className={seatSelectorStyles.pricingItem}>
                <div className={seatSelectorStyles.pricingRow}>
                  <span className={seatSelectorStyles.pricingLabel}>Standard (Rows A–C)</span>
                  <span className={seatSelectorStyles.pricingValueStandard}>₹{basePrice}</span>
                </div>
                <div className={seatSelectorStyles.pricingNote}>Rows A, B, C</div>
              </div>
              <div className={seatSelectorStyles.pricingItem} style={{ marginTop: "0.75rem" }}>
                <div className={seatSelectorStyles.pricingRow}>
                  <span className={seatSelectorStyles.pricingLabel}>Recliner (Rows D–E)</span>
                  <span className={seatSelectorStyles.pricingValueRecliner}>₹{Math.round(basePrice * 1.5)}</span>
                </div>
                <div className={seatSelectorStyles.pricingNote}>1.5× multiplier</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
