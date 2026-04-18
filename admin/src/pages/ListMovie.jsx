import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, X, Film } from "lucide-react";

const AUTH = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
});

const API = "http://localhost:5000/api/movies";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500/60 transition-colors";
const labelCls = "block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5";

export default function ListMovie() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", genre: "", basePrice: "", posterUrl: "", description: "",
  });

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API);
      setMovies(data);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/${id}`, AUTH());
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API, {
        title: form.title,
        genre: form.genre,
        basePrice: Number(form.basePrice),
        posterUrl: form.posterUrl,
        description: form.description,
      }, AUTH());
      setShowModal(false);
      setForm({ title: "", genre: "", basePrice: "", posterUrl: "", description: "" });
      fetchMovies();
    } catch (err) {
      alert(err?.response?.data?.message || "Add movie failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Cinzel', serif" }}>Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">{movies.length} movies in database</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all"
        >
          <Plus size={16} /> Add Movie
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(220,38,38,0.15)", background: "rgba(15,15,25,0.9)" }}>
        {loading ? (
          <div className="py-16 text-center text-gray-500 animate-pulse">Loading movies…</div>
        ) : movies.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No movies found. Add one above.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {["Poster", "Title", "Genre", "Base Price", "Slots", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr
                  key={m._id}
                  className="border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <td className="px-5 py-3">
                    {m.posterUrl ? (
                      <img src={m.posterUrl} alt={m.title}
                        className="w-10 h-14 object-cover rounded-lg border border-white/10" />
                    ) : (
                      <div className="w-10 h-14 rounded-lg bg-white/5 flex items-center justify-center">
                        <Film size={16} className="text-gray-600" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-semibold text-white">{m.title}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 bg-red-600/15 text-red-400 text-xs font-semibold rounded-full border border-red-600/20">
                      {m.genre}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-green-400 font-semibold">
                    ₹{m.basePrice}
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {m.showtimes?.length ?? 0}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleDelete(m._id)}
                      disabled={deleting === m._id}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-600/10 transition-all"
                      title="Delete movie"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Movie Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowModal(false)}
        >
          <div className="w-full max-w-md rounded-2xl border p-6"
            style={{
              background: "linear-gradient(135deg,#0f0f1a,#0a0a12)",
              borderColor: "rgba(220,38,38,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                Add Movie
              </h2>
              <button onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input required className={inputCls} placeholder="Movie title"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Genre *</label>
                <input required className={inputCls} placeholder="e.g. Action"
                  value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Base Price (₹) *</label>
                <input required type="number" min="1" className={inputCls} placeholder="250"
                  value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Poster URL</label>
                <input className={inputCls} placeholder="https://..."
                  value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea rows={3} className={inputCls} placeholder="Short synopsis…"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all disabled:opacity-50">
                {submitting ? "Adding…" : "Add Movie"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
