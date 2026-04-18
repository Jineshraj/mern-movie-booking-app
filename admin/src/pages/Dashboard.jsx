import { useEffect, useState } from "react";
import { Film, BookOpen, DollarSign, Users } from "lucide-react";
import axios from "axios";

const AUTH = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
});

const card = {
  wrapper:
    "rounded-2xl p-6 border flex items-center gap-5 transition-all hover:scale-[1.02]",
  icon: "p-3 rounded-xl",
  label: "text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1",
  value: "text-3xl font-bold text-white",
};

const STATS = [
  {
    key: "movies",
    label: "Total Movies",
    icon: Film,
    color: "#dc2626",
    bg: "rgba(220,38,38,0.12)",
    border: "rgba(220,38,38,0.25)",
  },
  {
    key: "bookings",
    label: "Total Bookings",
    icon: BookOpen,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
  },
  {
    key: "revenue",
    label: "Total Revenue",
    icon: DollarSign,
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
  },
  {
    key: "users",
    label: "Total Users",
    icon: Users,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    movies: "—",
    bookings: "—",
    revenue: "—",
    users: "—",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [moviesRes, bookingsRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/movies"),
          axios.get("http://localhost:5000/api/bookings/all", AUTH()),
        ]);

        const movies =
          moviesRes.status === "fulfilled" ? moviesRes.value.data : [];
        const bookings =
          bookingsRes.status === "fulfilled" ? bookingsRes.value.data : [];

        const revenue = bookings.reduce(
          (sum, b) => sum + (b.amountPaid || 0),
          0
        );
        const users = new Set(bookings.map((b) => b.user?._id || b.user)).size;

        setStats({
          movies: movies.length,
          bookings: bookings.length,
          revenue: `₹${revenue.toLocaleString("en-IN")}`,
          users,
        });
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1
        className="text-3xl font-bold text-white mb-2"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        Dashboard
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Welcome back, Admin — here's today's overview.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map(({ key, label, icon: Icon, color, bg, border }) => (
          <div
            key={key}
            className={card.wrapper}
            style={{
              background: `linear-gradient(135deg, ${bg} 0%, rgba(15,15,25,0.9) 100%)`,
              borderColor: border,
            }}
          >
            <div className={card.icon} style={{ background: bg }}>
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <div className={card.label}>{label}</div>
              <div className={card.value} style={{ color }}>
                {loading ? (
                  <span className="animate-pulse text-gray-600">…</span>
                ) : (
                  stats[key]
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sub info */}
      <div className="mt-10 rounded-2xl border p-6"
        style={{ borderColor: "rgba(220,38,38,0.15)", background: "rgba(15,15,25,0.8)" }}>
        <h2 className="text-lg font-semibold text-white mb-2"
          style={{ fontFamily: "'Cinzel', serif" }}>Quick Links</h2>
        <p className="text-gray-400 text-sm">
          Use the sidebar to manage your movie inventory, view all bookings, or track revenue. All data is live from your MongoDB Atlas cluster.
        </p>
      </div>
    </div>
  );
}
