import React, { useState, useEffect, useMemo } from 'react';
import api, { getApiBaseUrl } from '../utils/api';
import { Film, Ticket, Star, Calendar, Play as PlayIcon, Search, X, Play, Clock, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const styles5 = new Proxy({}, { get: function(target, prop) { const map = { listMoviesContainer: 'p-6 min-h-screen text-white bg-black/90', maxWidth7xl: 'max-w-7xl mx-auto', listMoviesHeader: 'mb-6 border-b border-white/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4', listMoviesHeaderInner: 'w-full flex items-center justify-between', listMoviesTitle: 'text-2xl font-bold text-white', listMoviesSubtitle: 'text-gray-400 text-sm', searchContainer: 'relative w-full max-w-sm mt-4 md:mt-0', searchBox: 'relative', searchInput: 'w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 text-white outline-none focus:border-red-500 transition-colors', searchIcon: 'absolute left-3 top-2.5 text-gray-400', filterContainer: 'flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide', filterButton: 'flex shrink-0 items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors', filterButtonActive: 'bg-red-600 text-white', filterButtonInactive: 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white', mainGrid: 'flex flex-col lg:flex-row gap-6', leftColumn: 'flex-1 min-w-0 border border-white/5 bg-white/5 p-4 rounded-xl', cardsGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4', errorContainer: 'p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg col-span-full', errorMessage: 'font-bold', errorRetryButton: 'bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 mt-2', emptyState: 'py-12 text-center text-gray-500 col-span-full', emptyStateText: 'text-lg font-bold text-white', emptyStateSubtext: 'text-sm', loadingState: 'py-12 text-center w-full col-span-full', loadingText: 'text-gray-400 font-bold tracking-widest uppercase animate-pulse', rightColumn: 'w-full lg:w-96 shrink-0', detailSidebar: 'bg-[#111] border border-white/10 rounded-xl p-5 sticky top-6 max-h-[90vh] overflow-y-auto', detailHeader: 'flex items-center justify-between mb-4 pb-3 border-b border-white/10', detailTitle: 'text-lg font-bold text-white uppercase tracking-wider', detailLiveIndicator: 'flex items-center gap-2 text-[10px] font-bold tracking-widest px-2 py-1 bg-red-600/20 text-red-500 rounded', detailLiveDot: 'w-2 h-2 rounded-full bg-red-500 animate-pulse', detailEmptyState: 'text-center py-20 text-gray-500 flex flex-col items-center', detailEmptyIcon: 'w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110', detailEmptyText: 'text-sm font-bold text-white', detailEmptySubtext: 'text-xs mt-1', card: 'bg-[#161616] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group relative flex flex-col shadow-lg shadow-black/40 hover:-translate-y-1 hover:shadow-red-600/10', cardDeleteButton: 'absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full z-10 shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:scale-110 transition-all', cardImage: 'w-full h-56 object-cover object-top transition-transform duration-500 group-hover:scale-105', cardContent: 'p-4 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#111]', cardHeader: 'mb-3', cardTitle: 'font-bold text-white uppercase tracking-wide truncate text-[15px]', cardCategories: 'flex gap-1.5 flex-wrap mt-1.5', cardCategory: 'text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-white/10 text-gray-400 rounded-sm', cardRatingContainer: 'flex gap-3 text-xs text-gray-400 mt-3', cardRating: 'flex items-center gap-1 text-yellow-500 font-bold', cardDuration: 'flex items-center gap-1 text-gray-300 font-medium', cardDescription: 'text-[11px] text-gray-500 leading-relaxed line-clamp-2 mt-2 flex-1', cardActions: 'mt-4 pt-3 border-t border-white/5 flex gap-2', cardViewButton: 'flex flex-1 items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white py-2 rounded transition-colors', cardTrailerButton: 'flex flex-1 items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-red-600/90 hover:bg-red-600 text-white py-2 px-3 rounded transition-colors shadow-lg shadow-red-900/20', personGrid: 'mt-6', personHeader: 'flex items-center gap-2 mb-3', personDot: 'w-1.5 h-1.5 bg-red-600 rounded-full', personTitle: 'text-[10px] font-bold uppercase tracking-widest text-gray-500', personList: 'flex gap-4 overflow-x-auto pb-2 scrollbar-hide', personItem: 'w-16 shrink-0 text-center group', personAvatar: 'w-14 h-14 rounded-full object-cover border-2 border-white/5 group-hover:border-white/20 mb-2 mx-auto bg-[#222] transition-colors', personName: 'text-[10px] text-gray-300 font-medium truncate', personRole: 'text-[9px] text-gray-500 uppercase tracking-wider truncate', detailContainer: 'animate-in fade-in slide-in-from-right-4 duration-300', detailHeaderContainer: 'flex items-start justify-between mb-6', detailTypeIndicator: 'flex items-center gap-2 mb-2', detailTypeDot: 'w-2 h-2 rounded-full', detailTypeText: 'text-[10px] uppercase tracking-widest text-gray-400 font-bold', detailContentTitle: 'text-2xl font-black text-white uppercase tracking-wide leading-tight', detailCloseButton: 'text-gray-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors', detailThumbnail: 'w-full rounded-xl overflow-hidden border border-white/10 relative shadow-2xl shadow-black mb-4', detailThumbnailImage: 'w-full aspect-video object-cover', detailPoster: 'w-32 md:w-full h-auto rounded-lg shadow-xl shadow-black object-cover border border-white/5', detailGrid: 'grid grid-cols-2 gap-4 bg-[#161616] p-4 rounded-xl border border-white/5', detailGridItem: 'flex flex-col', detailGridLabel: 'text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-1', detailGridValue: 'text-sm text-gray-200 font-medium', detailRatingValue: 'text-[15px] font-bold text-yellow-500 flex items-center gap-1.5', detailDescription: 'bg-[#161616] p-4 rounded-xl border border-white/5 mt-4', descriptionLabel: 'text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-2', descriptionText: 'text-[13px] text-gray-400 leading-relaxed', watchTrailerButton: 'w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl py-3.5 font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-900/30 mt-6', detailInfoGrid: 'grid grid-cols-2 gap-4 mt-4', detailInfoItem: 'bg-[#161616] p-3 rounded-xl border border-white/5 flex flex-col justify-center', detailInfoLabel: 'text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1', detailInfoValue: 'text-white font-semibold text-sm', seatPrice: 'text-emerald-400 font-mono font-bold text-base', storySection: 'mt-8', storyLabel: 'flex items-center gap-2 mb-3', storyDot: 'w-2 h-2 bg-red-600 rounded-full', storyText: 'text-[13px] text-gray-400 leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar', showtimesSection: 'bg-[#161616] border border-white/5 p-4 rounded-xl mt-6 relative overflow-hidden', showtimesHeader: 'flex items-center gap-2 mb-4 border-b border-white/10 pb-3', showtimesIcon: 'text-red-500', showtimesList: 'space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar', showtimeItem: 'flex justify-between items-center bg-white/5 p-2.5 rounded-lg text-sm border border-white/5 hover:bg-white/10 transition-colors', showtimeText: 'text-gray-300 font-semibold tracking-wide text-xs', showtimeStatus: 'flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded', showtimeDot: 'w-1.5 h-1.5 bg-emerald-500 rounded-full', showtimeStatusText: 'text-[9px] text-emerald-500 font-bold tracking-widest uppercase', releaseSoonContainer: 'text-center py-10 bg-[#161616] rounded-xl border border-white/5', releaseSoonImage: 'w-40 mx-auto mb-6 border border-white/10 rounded-lg overflow-hidden shadow-2xl shadow-black', releaseSoonText: 'text-2xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-3', releaseSoonCategories: 'flex justify-center flex-wrap gap-2 mb-5', releaseSoonCategory: 'text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10', releaseSoonMessage: 'text-[13px] font-medium text-gray-500 max-w-xs mx-auto' }; return map[prop] || ''; } });

const customStyles = ``;
const API_BASE = getApiBaseUrl();

function getImageUrl(maybe) {
  // Convert filename, uploads/filename, or partial to a full uploads URL.
  if (!maybe) return null;
  if (typeof maybe !== "string") return null;
  if (maybe.startsWith("http://") || maybe.startsWith("https://")) return maybe;
  // remove leading uploads/ if present
  const cleaned = String(maybe).replace(/^uploads\//, "");
  return `${API_BASE}/uploads/${cleaned}`;
}

export default function ListMoviesPage() {
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/movies');
      const mapped = res.data.map(m => ({...m, type: m.type || (m.categories && m.categories.includes('latestTrailers') ? 'latestTrailers' : 'normal')}));
      setMovies(mapped);
      setError(null);
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || 'Failed to fetch movies.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      toast.success('Movie deleted');
      fetchMovies();
      if(selected && (selected._id === id || selected.id === id)) setSelected(null);
    } catch (e) {
      toast.error('Deletion failed');
    }
  };

  const [movies, setMovies] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  function normalizeMovie(item) {
    // Clone so we don't mutate original
    const obj = { ...item };

    // Normalize top-level poster
    obj.poster = getImageUrl(item.poster) || (item.poster ? item.poster : null);

    // Normalize top-level cast/person previews (top-level arrays often store full URLs or file URL)
    const normalizeTopPeople = (arr = []) =>
      (arr || []).map((p) => ({
        ...(p || {}),
        preview:
          p?.preview ||
          getImageUrl(p?.file) ||
          p?.file ||
          p?.image ||
          p?.url ||
          null,
      }));

    obj.cast = normalizeTopPeople(item.cast);
    obj.directors = normalizeTopPeople(item.directors);
    obj.producers = normalizeTopPeople(item.producers);

    // If the document contains a latestTrailer object (some DBs store trailer as nested object),
    // expose useful fields at top-level and normalize person images which may be filenames.
    if (
      item.latestTrailer &&
      (item.type === "latestTrailers" ||
        item.latestTrailer.title ||
        item.latestTrailer.thumbnail ||
        item.latestTrailer.videoId)
    ) {
      const lt = item.latestTrailer || {};

      // Title (trailers may use `title` instead of movieName)
      obj.title = lt.title || item.title || item.movieName || null;

      // Thumbnail might be saved as filename (for latestTrailer persons/files we store filename), or full URL
      obj.thumbnail =
        getImageUrl(lt.thumbnail) ||
        getImageUrl(item.thumbnail) ||
        lt.thumbnail ||
        null;

      // trailer link: could be in latestTrailer.videoId or top-level trailerUrl
      obj.trailerUrl = lt.videoId || item.trailerUrl || lt.trailerUrl || null;

      // genres/year/rating/duration/description may live on lt
      obj.genres = lt.genres || item.genres || [];
      obj.year = lt.year || item.year || null;
      obj.rating = lt.rating ?? item.rating ?? null;
      obj.duration = lt.duration || item.duration || null;
      obj.description =
        lt.description || item.description || item.story || null;

      // Normalize latestTrailer persons (these often store file as filename)
      const normalizeLatestPeople = (arr = []) =>
        (arr || []).map((p) => ({
          ...(p || {}),
          preview: p?.preview || getImageUrl(p?.file) || p?.file || null,
        }));

      obj.directors = normalizeLatestPeople(
        lt.directors || item.latestTrailer?.directors || item.directors || []
      );
      obj.producers = normalizeLatestPeople(
        lt.producers || item.latestTrailer?.producers || item.producers || []
      );
      obj.singers = normalizeLatestPeople(
        lt.singers || item.latestTrailer?.singers || []
      );
    } else {
      // For non-latestTrailers, try to normalize thumbnail from other fields if present
      obj.thumbnail = getImageUrl(item.thumbnail) || obj.poster || null;
    }

    // Ensure type is set (some older records may not have type)
    obj.type =
      obj.type || (obj.title && !obj.movieName ? "latestTrailers" : "normal");

    // unify name/title usage for list/card UI
    obj.displayTitle =
      obj.movieName || obj.title || obj.movieName || "Untitled";

    return obj;
  }

  const types = useMemo(
    () => [
      { key: "all", label: "All", icon: Film },
      { key: "normal", label: "Normal", icon: Ticket },
      { key: "featured", label: "Featured", icon: Star },
      { key: "releaseSoon", label: "Coming Soon", icon: Calendar },
      { key: "latestTrailers", label: "Trailers", icon: PlayIcon },
    ],
    []
  );

  const filtered = useMemo(() => {
    // already requested filtered data from backend, but keep a guard to
    // exclude any cinenews entries if present in the returned list
    let arr = (movies || []).filter(item => item.type !== 'cinenews');
    if (filterType !== 'all') {
      arr = arr.filter(m => m.type === filterType);
    }
    if (search) {
      arr = arr.filter(m => String(m.title||m.movieName||m.displayTitle||'').toLowerCase().includes(search.toLowerCase()));
    }
    return arr.map(normalizeMovie);
  }, [movies, filterType, search]);


  return (
    <div className={"p-6 min-h-screen text-white bg-black/90"}>
      <style>{customStyles}</style>

      <div className={"max-w-7xl mx-auto"}>
        {/* Header */}
        <header className={"mb-6 border-b border-white/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"}>
          <div className={"w-full flex items-center justify-between"}>
            <div className="text-left">
              <h1 className={"text-2xl font-bold text-white"}>Movies</h1>
              <div className={"text-gray-400 text-sm"}>
                {loading ? "Loading..." : `${filtered.length} items`}
              </div>
            </div>

            {/* Search */}
            <div className={"relative w-full max-w-sm mt-4 md:mt-0"}>
              <div className={"relative"}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search movies, stories, trailers..."
                  className={"w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 text-white outline-none focus:border-red-500 transition-colors"}
                />
                <div className={"absolute left-3 top-2.5 text-gray-400"}>
                  <Search size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className={"flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide"}>
            {types.map((t) => {
              const IconComponent = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setFilterType(t.key);
                    // fetchMovies will run due to useEffect
                  }}
                  className={`${"flex shrink-0 items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors"} ${
                    filterType === t.key
                      ? "bg-red-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <IconComponent size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Main Grid */}
        <main className={"flex flex-col lg:flex-row gap-6"}>
          <div className={"flex-1 min-w-0 border border-white/5 bg-white/5 p-4 rounded-xl"}>
            <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"}>
              {error && (
                <div className={"p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg col-span-full"}>
                  <div className={"font-bold"}>Error</div>
                  <div className="text-sm mt-2">{error}</div>
                  <div className="mt-3">
                    <button
                      onClick={fetchMovies}
                      className={"bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 mt-2"}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {!error && filtered.length === 0 && !loading && (
                <div className={"py-12 text-center text-gray-500 col-span-full"}>
                  <div className={"text-lg font-bold text-white"}>No items found</div>
                  <div className={"text-sm"}>
                    Try adjusting your search or filters
                  </div>
                </div>
              )}

              {filtered.map((item) => (
                <Card
                  key={item._id || item.id || item.title || item.displayTitle}
                  item={item}
                  onOpen={() => setSelected(item)}
                  onDelete={() => handleDelete(item._id || item.id)}
                />
              ))}

              {loading && (
                <div className={"py-12 text-center w-full col-span-full"}>
                  <div className={"text-gray-400 font-bold tracking-widest uppercase animate-pulse"}>Loading movies…</div>
                </div>
              )}
            </div>
          </div>

          <aside className={"w-full lg:w-96 shrink-0"}>
            <div className={"bg-[#111] border border-white/10 rounded-xl p-5 sticky top-6 max-h-[90vh] overflow-y-auto custom-scrollbar"}>
              <div className={"flex items-center justify-between mb-4 pb-3 border-b border-white/10"}>
                <h2 className={"text-lg font-bold text-white uppercase tracking-wider"}>
                  Details
                </h2>
                <div className={"flex items-center gap-2 text-[10px] font-bold tracking-widest px-2 py-1 bg-red-600/20 text-red-500 rounded"}>
                  <div className={"w-2 h-2 rounded-full bg-red-500 animate-pulse"}></div>
                  <span className={styles5.detailLiveText}>Live</span>
                </div>
              </div>

              {selected ? (
                <DetailView item={selected} onClose={() => setSelected(null)} />
              ) : (
                <div className={"text-center py-20 text-gray-500 flex flex-col items-center"}>
                  <div className="flex items-center justify-center mb-3 w-full">
                    <div className={"w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110"}>
                      <Film size={60} className="text-red-600" />
                    </div>
                  </div>

                  <div className={"text-sm font-bold text-white"}>
                    Click "View Details" on a card
                  </div>
                  <div className={"text-xs mt-1"}>
                    Details will appear here after you click.
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

/* ---------------- Card and helpers ---------------- */

function Card({ item, onOpen, onDelete }) {
  const getTypeColor = (type) => {
    const colors = {
      featured: "from-orange-500 to-red-600",
      normal: "from-blue-500 to-purple-600",
      releaseSoon: "from-green-500 to-emerald-600",
      latestTrailers: "from-pink-500 to-rose-600",
    };
    return colors[type] || "from-gray-500 to-gray-600";
  };

  const posterOrThumb =
    item.poster ||
    item.thumbnail ||
    item.image ||
    item.latestTrailer?.thumbnail ||
    null;

  return (
    <div
      className={"bg-[#161616] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group relative flex flex-col shadow-lg shadow-black/40 hover:-translate-y-1 hover:shadow-red-600/10"}
      onClick={onOpen}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (typeof onDelete === "function") onDelete();
        }}
        title="Delete"
        aria-label={`Delete ${item.movieName || item.title}`}
        className={"absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full z-10 shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:scale-110 transition-all"}
      >
        <Trash2 size={16} />
      </button>

      <div className="relative">
        <img
          src={posterOrThumb}
          alt={item.movieName || item.title || item.displayTitle}
          className={"w-full h-56 object-cover object-top transition-transform duration-500 group-hover:scale-105"}
        />
      </div>

      <div className={"p-4 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#111]"}>
        <div className={"mb-3"}>
          <div className="flex-1 min-w-0">
            <h3 className={"font-bold text-white uppercase tracking-wide truncate text-[15px]"}>
              {item.movieName || item.title || item.displayTitle}
            </h3>
            <div className={"flex gap-1.5 flex-wrap mt-1.5"}>
              {(item.categories || item.genres || []).map((cat, index) => (
                <span
                  key={index}
                  className={"text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-white/10 text-gray-400 rounded-sm"}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* UPDATED: hide rating & duration for releaseSoon cards */}
          <div className={"flex gap-3 text-xs text-gray-400 mt-3"}>
            {item.type !== "releaseSoon" && (
              <>
                {item.rating && (
                  <div className={"flex items-center gap-1 text-yellow-500 font-bold"}>
                    <Star
                      className={styles5.cardRatingIcon}
                      size={14}
                      fill="currentColor"
                    />
                    <span className={styles5.cardRatingText}>
                      {item.rating}
                    </span>
                  </div>
                )}
                {item.duration && (
                  <div className={"flex items-center gap-1 text-gray-300 font-medium"}>
                    <Clock className={styles5.cardDurationIcon} size={14} />
                    <span className={styles5.cardDurationText}>
                      {displayDuration(item)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <p className={"text-[11px] text-gray-500 leading-relaxed line-clamp-2 mt-2 flex-1"}>
          {(item.story || item.description || item.excerpt || "").slice(0, 150)}
          {(item.story || item.description || item.excerpt || "").length >
            150 && "..."}
        </p>

        <div className={"mt-4 pt-3 border-t border-white/5 flex gap-2"}>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className={"flex flex-1 items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white py-2 rounded transition-colors"}
            >
              <Play size={16} />
              View Details
            </button>

            {item.trailerUrl && item.type !== "releaseSoon" && (
              <a
                href={item.trailerUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={"flex flex-1 items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-red-600/90 hover:bg-red-600 text-white py-2 px-3 rounded transition-colors shadow-lg shadow-red-900/20"}
              >
                <PlayIcon className={styles5.cardTrailerIcon} /> Trailer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function displayDuration(item) {
  if (!item) return "";
  // numeric (minutes)
  if (item.duration && typeof item.duration === "number") {
    const totalMins = item.duration;
    if (totalMins < 60) return `${totalMins}m`;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  }
  // object {hours, minutes}
  if (item.duration && typeof item.duration === "object") {
    const h = item.duration.hours ?? 0;
    const m = item.duration.minutes ?? 0;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  }
  return "";
}

function formatSlot(s) {
  try {
    const d = s.date ? new Date(s.date + "T00:00:00") : null;
    const dayName = d
      ? d.toLocaleDateString(undefined, { weekday: "short" })
      : "";
    const dateStr = d ? d.toLocaleDateString() : s.date || "";
    const time = s.time || "";
    const ampm = s.ampm || "";
    return `${dayName} ${dateStr} • ${time} ${ampm}`.trim();
  } catch (e) {
    return `${s.date || ""} ${s.time || ""} ${s.ampm || ""}`;
  }
}

function PersonGrid({ list = [], roleLabel = "" }) {
  if (!list || list.length === 0) return null;

  return (
    <div className={"mt-6"}>
      <div className={"flex items-center gap-2 mb-3"}>
        <div className={"w-1.5 h-1.5 bg-red-600 rounded-full"}></div>
        <div className={"text-[10px] font-bold uppercase tracking-widest text-gray-500"}>{roleLabel}</div>
      </div>
      <div className={"flex gap-4 overflow-x-auto pb-2 scrollbar-hide"}>
        {list.map((p, i) => (
          <div
            key={i}
            className={"w-16 shrink-0 text-center group"}
          >
            <div className="relative">
              <img
                src={p.preview || p.file || p.image || p.url || ""}
                alt={p.name || `${roleLabel}-${i}`}
                className={"w-14 h-14 rounded-full object-cover border-2 border-white/5 group-hover:border-white/20 mb-2 mx-auto bg-[#222] transition-colors"}
              />
            </div>
            <div className={"text-[10px] text-gray-300 font-medium truncate"}>
              {p.name || "-"}
            </div>
            {p.role && p.role !== roleLabel && (
              <div className={"text-[9px] text-gray-500 uppercase tracking-wider truncate"}>
                {p.role}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailView({ item, onClose }) {
  const getTypeGradient = (type) => {
    const gradients = {
      featured: "from-orange-500 to-red-600",
      normal: "from-blue-500 to-purple-600",
      releaseSoon: "from-green-500 to-emerald-600",
      latestTrailers: "from-pink-500 to-rose-600",
    };
    return gradients[type] || "from-gray-500 to-gray-600";
  };

  // final auditorium to display (fallback to "Audi 1")
  const displayAuditorium =
    item?.auditorium || item?.auditorium === "" ? item.auditorium : "Audi 1";

  return (
    <div className={"animate-in fade-in slide-in-from-right-4 duration-300"}>
      {/* Header */}
      <div className={"flex items-start justify-between mb-6"}>
        <div className="flex-1">
          <div className={"flex items-center gap-2 mb-2"}>
            <div
              className={`${"w-2 h-2 rounded-full"} bg-gradient-to-r ${getTypeGradient(
                item.type
              )}`}
            ></div>
            <span className={"text-[10px] uppercase tracking-widest text-gray-400 font-bold"}>
              {item.type === "featured" && "Featured Movie"}
              {item.type === "normal" && "Now Showing"}
              {item.type === "releaseSoon" && "Coming Soon"}
              {item.type === "latestTrailers" && "Latest Trailer"}
            </span>
          </div>
          <h2 className={"text-2xl font-black text-white uppercase tracking-wide leading-tight"}>
            {item.movieName || item.title || item.displayTitle}
          </h2>
        </div>
        <button
          onClick={onClose}
          className={"text-gray-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content based on type */}
      <div className="space-y-6">
        {/* Latest Trailers */}
        {item.type === "latestTrailers" && (
          <>
            {item.thumbnail && (
              <div className={"w-full rounded-xl overflow-hidden border border-white/10 relative shadow-2xl shadow-black mb-4"}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={"w-full aspect-video object-cover"}
                />
              </div>
            )}

            <div className={"grid grid-cols-2 gap-4 bg-[#161616] p-4 rounded-xl border border-white/5"}>
              {item.genres && item.genres.length > 0 && (
                <div className={"flex flex-col"}>
                  <div className={"text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-1"}>
                    Genres
                  </div>
                  <div className={"text-sm text-gray-200 font-medium"}>
                    {(item.genres || []).join(", ")}
                  </div>
                </div>
              )}
              {item.year && (
                <div className={"flex flex-col"}>
                  <div className={"text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-1"}>
                    Year
                  </div>
                  <div className={"text-sm text-gray-200 font-medium"}>{item.year}</div>
                </div>
              )}

              {item.duration && (
                <div className={"flex flex-col"}>
                  <div className={"text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-1"}>
                    Duration
                  </div>
                  <div className={"text-sm text-gray-200 font-medium"}>
                    {displayDuration(item)}
                  </div>
                </div>
              )}

              {item.rating && (
                <div className={"flex flex-col"}>
                  <div className={"text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-1"}>
                    Rating
                  </div>
                  <div className={"text-[15px] font-bold text-yellow-500 flex items-center gap-1.5"}>
                    <Star size={16} fill="currentColor" />
                    {item.rating}/10
                  </div>
                </div>
              )}

              {/* NEW: Auditorium display for trailers too (if present) */}
              <div className={"flex flex-col"}>
                <div className={"text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-1"}>
                  Auditorium
                </div>
                <div className={"text-sm text-gray-200 font-medium"}>
                  {displayAuditorium}
                </div>
              </div>
            </div>

            <div className={"bg-[#161616] p-4 rounded-xl border border-white/5 mt-4"}>
              <div className={"text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-2"}>
                Description
              </div>
              <div className={"text-[13px] text-gray-400 leading-relaxed"}>
                {item.description}
              </div>
            </div>

            {item.trailerUrl && (
              <a
                href={item.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className={"w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl py-3.5 font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-900/30 mt-6"}
              >
                <Play size={20} />
                Watch Trailer Now
              </a>
            )}

            <PersonGrid list={item.directors} roleLabel="Directors" />
            <PersonGrid list={item.producers} roleLabel="Producers" />
            <PersonGrid list={item.singers} roleLabel="Singers" />
          </>
        )}

        {/* Normal & Featured Movies */}
        {(item.type === "normal" || item.type === "featured") && (
          <>
            <div className="grid grid-cols-1 gap-6">
              <div className={"w-full rounded-xl overflow-hidden border border-white/10 relative shadow-2xl shadow-black mb-4"}>
                <img
                  src={item.poster}
                  alt={item.movieName}
                  className={"w-32 md:w-full h-auto rounded-lg shadow-xl shadow-black object-cover border border-white/5"}
                />
              </div>

              <div className={"grid grid-cols-2 gap-4 mt-4"}>
                <div className={"bg-[#161616] p-3 rounded-xl border border-white/5 flex flex-col justify-center"}>
                  <div className={"text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1"}>
                    Rating
                  </div>
                  <div className={"text-[15px] font-bold text-yellow-500 flex items-center gap-1.5"}>
                    <Star size={18} fill="currentColor" />
                    {item.rating ?? "-"}
                    /10
                  </div>
                </div>

                <div className={"bg-[#161616] p-3 rounded-xl border border-white/5 flex flex-col justify-center"}>
                  <div className={"text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1"}>
                    Duration
                  </div>
                  <div className={"text-[15px] font-bold text-yellow-500 flex items-center gap-1.5"}>
                    <Clock size={18} />
                    {displayDuration(item)}
                  </div>
                </div>

                {/* NEW: Auditorium block */}
                <div className={"bg-[#161616] p-3 rounded-xl border border-white/5 flex flex-col justify-center"}>
                  <div className={"text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1"}>
                    Auditorium
                  </div>
                  <div className={"text-white font-semibold text-sm"}>
                    {displayAuditorium}
                  </div>
                </div>

                {item.seatPrices && (
                  <>
                    <div className={"bg-[#161616] p-3 rounded-xl border border-white/5 flex flex-col justify-center"}>
                      <div className={"text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1"}>
                        Standard
                      </div>
                      <div className={"text-emerald-400 font-mono font-bold text-base"}>
                        ₹{item.seatPrices.standard}
                      </div>
                    </div>

                    <div className={"bg-[#161616] p-3 rounded-xl border border-white/5 flex flex-col justify-center"}>
                      <div className={"text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1"}>
                        Recliner
                      </div>
                      <div className={"text-emerald-400 font-mono font-bold text-base"}>
                        ₹{item.seatPrices.recliner}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {item.trailerUrl && (
                <a
                  href={item.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${"flex flex-1 items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-red-600/90 hover:bg-red-600 text-white py-2 px-3 rounded transition-colors shadow-lg shadow-red-900/20"} justify-center`}
                >
                  <Play size={18} />
                  Watch Official Trailer
                </a>
              )}
            </div>

            <div className={"mt-8"}>
              <div className={"flex items-center gap-2 mb-3"}>
                <div className={"w-2 h-2 bg-red-600 rounded-full"}></div>
                <div className={"text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-2"}>
                  Story
                </div>
              </div>
              <div className={"text-[13px] text-gray-400 leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar"}>
                {item.story}
              </div>
            </div>

            {(item.slots || []).length > 0 && (
              <div className={"bg-[#161616] border border-white/5 p-4 rounded-xl mt-6 relative overflow-hidden"}>
                <div className={"flex items-center gap-2 mb-4 border-b border-white/10 pb-3"}>
                  <Calendar size={20} className={"text-red-500"} />
                  <div className={"text-[9px] uppercase text-gray-500 tracking-widest font-bold mb-2"}>
                    Showtimes
                  </div>
                </div>
                <div className={"space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar"}>
                  {(item.slots || []).map((s, i) => (
                    <div
                      key={i}
                      className={"flex justify-between items-center bg-white/5 p-2.5 rounded-lg text-sm border border-white/5 hover:bg-white/10 transition-colors"}
                    >
                      <div className={"text-gray-300 font-semibold tracking-wide text-xs"}>
                        {formatSlot(s)}
                      </div>
                      <div className={"flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded"}>
                        <div className={"w-1.5 h-1.5 bg-emerald-500 rounded-full"}></div>
                        <span className={"text-[9px] text-emerald-500 font-bold tracking-widest uppercase"}>
                          AVAILABLE
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PersonGrid list={item.cast} roleLabel="Cast" />
            <PersonGrid list={item.directors} roleLabel="Directors" />
            <PersonGrid list={item.producers} roleLabel="Producers" />
          </>
        )}

        {/* Release Soon */}
        {item.type === "releaseSoon" && (
          <div className={"text-center py-10 bg-[#161616] rounded-xl border border-white/5"}>
            <div className={"w-40 mx-auto mb-6 border border-white/10 rounded-lg overflow-hidden shadow-2xl shadow-black"}>
              <img
                src={item.poster}
                alt={item.movieName}
                className={"w-32 md:w-full h-auto rounded-lg shadow-xl shadow-black object-cover border border-white/5"}
              />
            </div>
            <div className={"text-2xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-3"}>
              Coming Soon
            </div>
            <div className={"flex justify-center flex-wrap gap-2 mb-5"}>
              {(item.categories || []).map((cat, i) => (
                <span
                  key={i}
                  className={"text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10"}
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className={"text-[13px] font-medium text-gray-500 max-w-xs mx-auto"}>
              Stay tuned for more updates!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}