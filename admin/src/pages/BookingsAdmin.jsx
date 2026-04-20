import { useEffect, useState } from "react";
import axios from "axios";

const AUTH = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
});

const STATUS_COLOR = {
  paid:    { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.25)" },
  pending: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  failed:  { bg: "rgba(220,38,38,0.12)",  text: "#f87171", border: "rgba(220,38,38,0.25)" },
};

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/bookings/all",
          AUTH()
        );
        setBookings(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalRevenue = bookings.reduce((s, b) => s + (b.amountPaid || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Cinzel', serif" }}>All Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} •&nbsp;
            Total Revenue:&nbsp;
            <span className="text-green-400 font-semibold">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border overflow-x-auto"
        style={{ borderColor: "rgba(220,38,38,0.15)", background: "rgba(15,15,25,0.9)" }}>
        {loading ? (
          <div className="py-16 text-center text-gray-500 animate-pulse">Loading bookings…</div>
        ) : error ? (
          <div className="py-16 text-center text-red-400">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No bookings yet.</div>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {["Booking ID", "Movie", "User", "Seats", "Amount", "Status", "Date"].map((h) => (
                  <th key={h}
                    className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const s = STATUS_COLOR[b.paymentStatus] || STATUS_COLOR.pending;
                return (
                  <tr key={b._id}
                    className="border-b hover:bg-white/[0.02] transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">
                      {b._id.slice(-8)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-white">
                      {b.movieTitle ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {b.user?.email ?? b.user?.fullName ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-300">
                      {Array.isArray(b.seats) ? b.seats.join(", ") : "—"}
                    </td>
                    <td className="px-5 py-3 text-green-400 font-semibold">
                      ₹{(b.amountPaid || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold border capitalize"
                        style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {new Date(b.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
