import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import { normalizeBookingData } from "../utils/dataAdapters";
import { Ticket, Search, Calendar, Film } from "lucide-react";

const formatSlot = (date) => {
  if (!date) return "N/A";
  if (!(date instanceof Date)) date = new Date(date);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const fmtINR = (n) => typeof n === "number" ? `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "₹0";

export default function Bookings() {
  const [selectedMovie, setSelectedMovie] = useState("");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchBookings() {
      setLoading(true);
      try {
        const res = await api.get("/bookings/all");
        const data = res?.data;
        let items = Array.isArray(data) ? data : (data?.items || data?.bookings || []);
        
        const mapped = items.map(b => {
          const norm = normalizeBookingData(b);
          if(!norm) return null;
          // Alias backwards compatibility specifically for this local UI layout structure
          return { ...norm, movie: norm.movieTitle };
        }).filter(Boolean);


        if (!cancelled) setBookings(mapped);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBookings();
    return () => { cancelled = true; };
  }, []);

  const moviesList = useMemo(() => Array.from(new Set(bookings.map((b) => b.movie))).filter(Boolean), [bookings]);

  const bookingsToShow = useMemo(() => {
    let filtered = selectedMovie ? bookings.filter((b) => b.movie === selectedMovie) : bookings;
    if (search) filtered = filtered.filter(b => b.customer.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()));
    return filtered;
  }, [selectedMovie, bookings, search]);

  return (
    <div className="p-6 text-white bg-black/90 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
           <div>
             <h1 className="text-3xl font-bold uppercase tracking-wider flex items-center gap-3"><Ticket className="text-red-500" size={32}/> Bookings Registry</h1>
             <p className="text-gray-400 text-sm mt-1">{bookingsToShow.length} records found</p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4">
             <div className="relative">
               <Search size={18} className="absolute left-3 top-2.5 text-gray-500"/>
               <input 
                 type="text" 
                 placeholder="Search customer or ID..." 
                 className="bg-[#161616] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-full md:w-64 focus:border-red-500 outline-none transition-colors"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
             </div>
             
             <select 
               className="bg-[#161616] border border-white/10 rounded-full px-4 py-2 text-sm focus:border-red-500 outline-none transition-colors max-w-xs truncate"
               value={selectedMovie}
               onChange={e => setSelectedMovie(e.target.value)}
             >
               <option value="">All Movies</option>
               {moviesList.map(m => <option key={m} value={m}>{m}</option>)}
             </select>
           </div>
        </header>

        {loading ? (
          <div className="py-20 text-center animate-pulse text-gray-500 font-bold tracking-widest uppercase">Fetching Bookings...</div>
        ) : bookingsToShow.length === 0 ? (
          <div className="py-20 text-center text-gray-500 bg-[#161616] rounded-xl border border-white/5">
             <Ticket size={48} className="mx-auto mb-4 opacity-50"/>
             <h3 className="text-xl font-bold text-white mb-1">No Bookings Found</h3>
             <p className="text-sm">Try tweaking your search or filters.</p>
          </div>
        ) : (
          <div className="bg-[#161616] border border-white/5 rounded-xl overflow-x-auto shadow-xl shadow-black/50">
             <table className="w-full text-left whitespace-nowrap">
                <thead>
                   <tr className="bg-black/40 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                      <th className="px-6 py-4 rounded-tl-xl">ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Movie Info</th>
                      <th className="px-6 py-4">Seats</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 rounded-tr-xl">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {bookingsToShow.map(b => (
                     <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{b.id.slice(-8).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-200">{b.customer}</td>
                        <td className="px-6 py-4">
                           <div className="text-sm font-bold text-white truncate max-w-xs">{b.movie}</div>
                           <div className="flex gap-2 items-center mt-1 text-[11px] text-gray-500 tracking-wide">
                              <span className="flex items-center gap-1"><Calendar size={10}/> {formatSlot(b.slot)}</span>
                              <span>•</span>
                              <span className="text-red-400 font-semibold">{b.auditorium}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-1 flex-wrap w-32">
                              {b.seats.length > 0 ? b.seats.map(s => <span key={s} className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded font-mono text-gray-300 border border-white/10">{s}</span>) : "-"}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-emerald-400 font-bold font-mono">{fmtINR(b.amount)}</span>
                        </td>
                        <td className="px-6 py-4">
                           {b.paymentStatus === "paid" || b.status === "paid" ? (
                             <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">Paid</span>
                           ) : (
                             <span className="bg-yellow-500/20 text-yellow-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-yellow-500/20">Pending</span>
                           )}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

      </div>
    </div>
  );
}
