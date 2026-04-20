import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import { normalizeBookingData } from "../utils/dataAdapters";
import { Film, Users, BookOpen, IndianRupee, AlertTriangle } from "lucide-react";

const fmtINR = (num) => typeof num === "number" ? `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "₹0";

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [mRes, bRes, uRes] = await Promise.allSettled([
          api.get("/movies"),
          // TODO: TECH DEBT - Create a backend specific endpoint '/api/dashboard/stats' to aggregate 
          // total revenue, users, and movies so the frontend doesn't download the entire database.
          api.get("/bookings/all"),
          api.get("/users")
        ]);

        if (!cancelled && (mRes.status === "rejected" || bRes.status === "rejected" || uRes.status === "rejected")) {
           setError("Warning: Some API streams failed or crashed. Data may be incomplete.");
        }

        const normaliseArrayResponse = (r) => {
          if (!r || r.status === "rejected") return [];
          const data = r.value?.data;
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (Array.isArray(data.items)) return data.items;
          return [];
        };

        const rawMovies = normaliseArrayResponse(mRes);
        const rawBookings = normaliseArrayResponse(bRes);
        const rawUsers = normaliseArrayResponse(uRes);

        const normMovies = rawMovies.map((m) => ({
          id: m._id || m.id || "",
          title: m.title || "Untitled",
          basePrice: Number(m.basePrice || 0) || 0,
        }));

        const normBookings = rawBookings.map(b => normalizeBookingData(b)).filter(Boolean);
        const paidBookings = normBookings;

        const normUsers = rawUsers.map((u) => ({
          id: u._id || "",
          name: u.name || "",
        }));

        if (!cancelled) {
          setMovies(normMovies);
          setBookings(paidBookings);
          setUsers(normUsers);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("dashboard fetch error:", err);
          setError("A critical error occurred while building the dashboard.");
          setLoading(false);
        }
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const summary = useMemo(() => {
    const totalBookings = bookings.length;
    let totalRevenue = 0;
    for (let i = 0; i < bookings.length; i++) totalRevenue += bookings[i].totalPaid || 0;
    const totalUsers = users.length;

    const map = {};
    const movieTitleMap = {};
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].id) movieTitleMap[movies[i].id] = movies[i].title;
    }

    for (let i = 0; i < bookings.length; i++) {
      const bk = bookings[i];
      const key = bk.movieId || bk.movieTitle || `unknown-${i}`;
      const title = movieTitleMap[bk.movieId] || bk.movieTitle || "Unknown";
      if (!map[key]) map[key] = { id: key, title, bookings: 0, earnings: 0 };
      map[key].bookings += 1;
      map[key].earnings += bk.totalPaid || 0;
    }

    const movieStats = Object.values(map).sort((a, b) => b.bookings - a.bookings);
    return { totalBookings, totalRevenue, totalUsers, movieStats };
  }, [movies, bookings, users]);

  if(loading) return <div className="p-6 text-white text-center">Loading Dashboard...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Cinzel', serif" }}>Admin Dashboard</h1>
      
      {error && (
        <div className="mb-8 p-4 bg-red-900/40 border border-red-500 rounded-xl flex items-center gap-3 text-red-200">
          <AlertTriangle className="text-red-500" />
          <p>{error}</p>
        </div>
      )}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between shadow-lg shadow-black/20">
            <div>
               <div className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-1">Total Revenue</div>
               <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{fmtINR(summary.totalRevenue)}</div>
            </div>
            <div className="p-4 bg-red-600/10 rounded-full text-red-500"><IndianRupee size={28}/></div>
         </div>
         <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between shadow-lg shadow-black/20">
            <div>
               <div className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-1">Bookings</div>
               <div className="text-3xl font-bold">{summary.totalBookings}</div>
            </div>
            <div className="p-4 bg-blue-600/10 rounded-full text-blue-500"><BookOpen size={28}/></div>
         </div>
         <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between shadow-lg shadow-black/20">
            <div>
               <div className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-1">Registered Users</div>
               <div className="text-3xl font-bold">{summary.totalUsers}</div>
            </div>
            <div className="p-4 bg-emerald-600/10 rounded-full text-emerald-500"><Users size={28}/></div>
         </div>
      </div>

      {/* Aggregate Stats */}
      <h2 className="text-xl font-bold mb-4">Movie Performance</h2>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 rounded-tl-xl">Movie</th>
                  <th className="p-4">Bookings</th>
                  <th className="p-4">Total Earnings</th>
                  <th className="p-4 rounded-tr-xl">Avg / Booking</th>
               </tr>
            </thead>
            <tbody>
               {summary.movieStats.map((m, i) => {
                 const avg = m.bookings ? Math.round(m.earnings / m.bookings) : 0;
                 return (
                   <tr key={m.id || i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                     <td className="p-4 font-semibold text-white/90">{m.title}</td>
                     <td className="p-4">{m.bookings}</td>
                     <td className="p-4 font-mono text-green-400">{fmtINR(m.earnings)}</td>
                     <td className="p-4 text-gray-300">{fmtINR(avg)}</td>
                   </tr>
                 );
               })}
               {summary.movieStats.length === 0 && (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">No active bookings found.</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
