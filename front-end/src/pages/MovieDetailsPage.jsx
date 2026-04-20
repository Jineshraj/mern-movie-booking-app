import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Play,
  Users,
  User,
  X,
} from "lucide-react";
import { movieDetailHStyles } from "../assets/dummyStyles";
import api, { getApiBaseUrl } from "../utils/api";

// ── Constants (repo snippet) ───────────────────────────────────────────────────
const ROWS = [
  { id: "A", type: "standard", count: 8 },
  { id: "B", type: "standard", count: 8 },
  { id: "C", type: "standard", count: 8 },
  { id: "D", type: "recliner", count: 8 },
  { id: "E", type: "recliner", count: 8 },
];
const TOTAL_SEATS = ROWS.reduce((s, r) => s + r.count, 0);

// ── Utility helpers (repo snippet) ────────────────────────────────────────────
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  if (/^[A-Za-z0-9_-]{6,}$/.test(urlOrId)) return urlOrId;
  const re =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;
  const m = urlOrId.match(re);
  return m ? m[1] : null;
}

const getEmbedUrl = (id) =>
  id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : null;

const getParts = (dateLike, timeZone) => {
  const dt = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(dt);
  const map = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  map.dayPeriod = map.dayPeriod || map.ampm || map.AMPM;
  return map;
};

const formatDateKey = (dateLike, timeZone = "Asia/Kolkata") => {
  const p = getParts(dateLike, timeZone);
  return `${p.year}-${p.month}-${p.day}`;
};

const formatTimeInTZ = (dateLike, timeZone = "Asia/Kolkata") => {
  const p = getParts(dateLike, timeZone);
  const hour = String(Number(p.hour));
  return `${hour}:${p.minute} ${String(p.dayPeriod ?? "").toUpperCase()}`;
};

// ── Fallback avatar (repo snippet) ────────────────────────────────────────────
const FallbackAvatar = ({ className = "w-12 h-12" }) => (
  <div
    className={`${className} bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300`}
  >
    ?
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/movies/${id}`)
      .then(res => {
         setMovie(res.data);
      })
      .catch(err => {
         console.error(err);
      })
      .finally(() => {
         setLoading(false);
      });
  }, [id]);

  // Trailer state
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailerId, setSelectedTrailerId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Showtime state
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  // ── Runtime Mapping: showtimeDays useMemo (Mongoose format) ──────────────────────
  const showtimeDays = useMemo(() => {
    if (!movie || !movie.showtimes) return [];
    
    const slotsByDate = {};
    movie.showtimes.forEach(slot => {
        if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
        slotsByDate[slot.date].push(slot);
    });

    return Object.keys(slotsByDate).sort().map(key => {
        const [yy, mm, dd] = key.split("-").map(Number);
        const asDate = new Date(Date.UTC(yy, mm - 1, dd));
        const shortDay = new Intl.DateTimeFormat("en-US", {
          weekday: "short", timeZone: "UTC"
        }).format(asDate);
        const dateStr = new Intl.DateTimeFormat("en-US", {
          month: "short", day: "numeric", timeZone: "UTC"
        }).format(asDate);

        const showtimes = slotsByDate[key].map(slot => {
             // Rebuild a JS valid Date simulating local ISO layouts
             const synDate = new Date(`${slot.date} ${slot.time} ${slot.ampm}`);
             const displayTime = `${slot.time} ${slot.ampm}`;
             return {
                 time: displayTime,
                 datetime: !isNaN(synDate.getTime()) ? synDate.toISOString() : slot.date, 
                 audi: movie.auditorium || "Audi 1",
                 bookedCount: slot.bookedSeats?.length || 0
             };
        });
        
        return { date: key, shortDay, dateStr, showtimes };
    });
  }, [movie]);

  // ── Repo snippet: getBookedCountFor with audi + legacy fallback ────────────
  const getBookedCountFor = (datetime, audi = "Audi 1") => {
    // Rely exclusively on API fetched payload hooks! Local storage legacy simulations wiped cleanly
    if (!movie || !movie.showtimes) return 0;
    const allCount = showtimeDays.reduce((acc, curr) => {
         const slot = curr.showtimes.find(s => s.datetime === datetime);
         if (slot) return slot.bookedCount;
         return acc;
    }, 0);
    return allCount;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openTrailer = (movieObj) => {
    const ytId = extractYouTubeId(
      movieObj?.trailerUrl || 
      movieObj?.trailer || 
      movieObj?.latestTrailer?.videoId || 
      ""
    );
    if (!ytId) {
      toast.info("Trailer not available for this movie.");
      return;
    }
    setSelectedMovie(movieObj);
    setSelectedTrailerId(ytId);
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setSelectedTrailerId(null);
    setSelectedMovie(null);
  };

  const handleTimeSelect = (datetime) => {
    setSelectedTime((prev) => (prev === datetime ? null : datetime));
  };

  const handleBookNow = () => {
    if (!selectedTime) {
      toast.error("Please select a showtime first.");
      return;
    }
    navigate(`/seat/${movie._id}/${encodeURIComponent(selectedTime)}`);
  };

  // ── Not found ─────────────────────────────────────────────────────────────
  if (loading) {
     return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading movie details...</div>;
  }

  if (!movie) {
    return (
      <div className={movieDetailHStyles.notFoundContainer}>
        <div className={movieDetailHStyles.notFoundContent}>
          <p className={movieDetailHStyles.notFoundTitle}>Movie not found.</p>
          <Link to="/movies" className={movieDetailHStyles.notFoundLink}>
            ← Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={movieDetailHStyles.pageContainer}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <style>{movieDetailHStyles.customCSS}</style>

      {/* ── Trailer Modal (repo snippet) ───────────────────────────────────── */}
      {showTrailer && selectedTrailerId && (
        <div className={movieDetailHStyles.trailerModal}>
          <div
            className={movieDetailHStyles.trailerContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeTrailer}
              className={movieDetailHStyles.closeButton}
              aria-label="Close trailer"
            >
              <X size={36} />
            </button>
            <div className={movieDetailHStyles.trailerIframe}>
              <iframe
                key={selectedTrailerId}
                width="100%"
                height="100%"
                src={getEmbedUrl(selectedTrailerId)}
                title={`${selectedMovie?.title || "Trailer"} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={movieDetailHStyles.iframe}
              />
            </div>
          </div>
        </div>
      )}

      <div className={movieDetailHStyles.mainContainer}>
        {/* Header */}
        <div className={movieDetailHStyles.headerContainer}>
          <Link to="/movies" className={movieDetailHStyles.backButton}>
            <ArrowLeft size={18} />
            <span className={movieDetailHStyles.backButtonText}>Back</span>
          </Link>
        </div>

        {/* Title + Meta */}
        <div className={movieDetailHStyles.titleContainer}>
          <h1
            className={movieDetailHStyles.movieTitle}
            style={{
              fontFamily: "'Cinzel', 'Times New Roman', serif",
              textShadow: "0 4px 20px rgba(220, 38, 38, 0.6)",
              letterSpacing: "0.08em",
            }}
          >
            {movie.title}
          </h1>
          <div className={movieDetailHStyles.movieInfoContainer}>
            <span className={movieDetailHStyles.rating}>
              <Star className={movieDetailHStyles.ratingIcon} />
              {movie.rating}/10
            </span>
            <span className={movieDetailHStyles.duration}>
              <Clock className={movieDetailHStyles.durationIcon} />
              {movie.duration}
            </span>
            <span className={movieDetailHStyles.genre}>{movie.genre}</span>
          </div>
        </div>

        {/* ── Rule 4: Layout — poster LEFT, showtimes+cast RIGHT ────────────── */}
        <div className={movieDetailHStyles.mainGrid}>
          {/* LEFT — Poster */}
          <div className={movieDetailHStyles.posterContainer}>
            <div className={movieDetailHStyles.posterCard}>
              <div
                className={movieDetailHStyles.posterImageContainer}
                style={{ maxWidth: "320px" }}
              >
                <img
                  src={(() => {
                    const raw = movie.posterUrl || "";
                    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
                    const cleaned = raw.startsWith("uploads/") ? raw : `uploads/${raw}`;
                    return `${getApiBaseUrl()}/${cleaned}`;
                  })()}
                  alt={movie.title}
                  loading="eager"
                  className={movieDetailHStyles.posterImage}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://via.placeholder.com/320x480?text=No+Image";
                  }}
                />
              </div>

              <button
                onClick={() => openTrailer(movie)}
                className={movieDetailHStyles.trailerButton}
                aria-label="Watch trailer"
              >
                <Play size={18} />
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>

          {/* RIGHT — Showtimes + Cast (both in same column per Rule 4) */}
          <div className={movieDetailHStyles.showtimesContainer}>

            {/* Showtimes card */}
            <div className={movieDetailHStyles.showtimesCard}>
              <h3
                className={movieDetailHStyles.showtimesTitle}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Calendar className={movieDetailHStyles.showtimesTitleIcon} />
                <span>Showtimes</span>
              </h3>

              {/* Day selector */}
              <div className={movieDetailHStyles.daySelection}>
                {showtimeDays.length ? (
                  showtimeDays.map((day, index) => (
                    <button
                      key={day.date}
                      onClick={() => {
                        setSelectedDay(index);
                        setSelectedTime(null);
                      }}
                      className={`${movieDetailHStyles.dayButton} ${
                        selectedDay === index
                          ? movieDetailHStyles.dayButtonSelected
                          : movieDetailHStyles.dayButtonDefault
                      }`}
                      aria-pressed={selectedDay === index}
                    >
                      <div className={movieDetailHStyles.dayName}>
                        {day.shortDay}
                      </div>
                      <div className={movieDetailHStyles.dayDate}>
                        {day.dateStr}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm px-2">
                    No showtime dates available
                  </div>
                )}
              </div>

              {/* Showtime grid */}
              <div className={movieDetailHStyles.showtimesGrid}>
                {showtimeDays[selectedDay]?.showtimes?.length ? (
                  showtimeDays[selectedDay].showtimes.map((showtime, index) => {
                    const bookedCount = getBookedCountFor(
                      showtime.datetime,
                      showtime.audi
                    );
                    const isSoldOut = bookedCount >= TOTAL_SEATS;
                    return (
                      <button
                        key={index}
                        onClick={() => handleTimeSelect(showtime.datetime)}
                        className={`${movieDetailHStyles.showtimeButton} ${
                          selectedTime === showtime.datetime
                            ? movieDetailHStyles.showtimeButtonSelected
                            : movieDetailHStyles.showtimeButtonDefault
                        }`}
                        title={
                          isSoldOut
                            ? "All seats booked for this showtime"
                            : `Seats available: ${Math.max(
                                0,
                                TOTAL_SEATS - bookedCount
                              )}`
                        }
                        aria-disabled={isSoldOut}
                      >
                        <span>{showtime.time}</span>
                        {isSoldOut && (
                          <span className={movieDetailHStyles.soldOutBadge}>
                            Sold Out
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className={movieDetailHStyles.noShowtimes}>
                    No showtimes available for the selected date
                  </div>
                )}
              </div>

              {/* Book Now — only shown when a time is selected */}
              {selectedTime && (
                <div className={movieDetailHStyles.bookNowContainer}>
                  <button
                    onClick={handleBookNow}
                    className={movieDetailHStyles.bookNowButton}
                    aria-label="Proceed to seat selection"
                  >
                    Proceed to Seat Selection
                  </button>
                </div>
              )}
            </div>

            {/* Cast card — inside right column, below showtimesCard */}
            <div className={movieDetailHStyles.castCard}>
              <h3
                className={movieDetailHStyles.castTitle}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Users className={movieDetailHStyles.castTitleIcon} />
                <span>Cast</span>
              </h3>

              <div className={movieDetailHStyles.castGrid}>
                {movie.cast?.length ? (
                  movie.cast.map((c, idx) => (
                    <div key={idx} className={movieDetailHStyles.castMember}>
                      <div className={movieDetailHStyles.castImageContainer}>
                        {(() => {
                          const castImgRaw = c.avatarUrl || c.img || c.image || c.file || c.url || null;
                          if (castImgRaw) {
                            const castImgSrc = castImgRaw.startsWith("http")
                              ? castImgRaw
                              : `${getApiBaseUrl()}/uploads/${castImgRaw.replace(/^\/?(uploads\/)?/, "")}`;
                            return (
                              <img
                                src={castImgSrc}
                                alt={c.name}
                                loading="lazy"
                                className={movieDetailHStyles.castImage}
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://via.placeholder.com/80?text=A"; }}
                              />
                            );
                          }
                          return <FallbackAvatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />;
                        })()}
                      </div>
                      <div className={movieDetailHStyles.castName}>{c.name}</div>
                      <div className={movieDetailHStyles.castRole}>{c.role}</div>
                    </div>
                  ))
                ) : (
                  <div className={movieDetailHStyles.noCastMessage}>
                    No cast data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Story — full width below grid */}
        <div className={movieDetailHStyles.storyCard}>
          <h2
            className={movieDetailHStyles.storyTitle}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Story
          </h2>
          <p className={movieDetailHStyles.storyText}>{movie.description || movie.story || movie.synopsis || "No story available."}</p>
        </div>

        {/* Director & Producer — full width below story */}
        <div className={movieDetailHStyles.crewGrid}>
          {/* Director */}
          <div className={movieDetailHStyles.crewCard}>
            <div className={movieDetailHStyles.crewTitle}>
              <User className={movieDetailHStyles.crewIcon} />
              <h3 style={{ fontFamily: "'Cinzel', serif" }}>Director</h3>
            </div>
            <div className={movieDetailHStyles.crewContent}>
              {(() => {
                const directors = Array.isArray(movie.directors)
                  ? movie.directors
                  : Array.isArray(movie.director)
                  ? movie.director
                  : movie.director
                  ? [movie.director]
                  : [];
                return (
                  <div className={movieDetailHStyles.crewGridInner}>
                    {directors.length ? (
                      directors.slice(0, 2).map((d, i) => (
                        <div key={i} className="flex flex-col items-center">
                          {(() => {
                            const raw = d?.avatarUrl || d?.img || d?.image || null;
                            if (raw) {
                              const src = raw.startsWith("http") ? raw : `${getApiBaseUrl()}/uploads/${raw.replace(/^\/?(uploads\/)?/, "")}`;
                              return <img src={src} alt={d.name || `Director ${i+1}`} loading="lazy" className={movieDetailHStyles.crewImage} onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src="https://via.placeholder.com/96?text=D"; }} />;
                            }
                            return <div className={movieDetailHStyles.fallbackAvatar}>?</div>;
                          })()}
                          <div className={movieDetailHStyles.crewName}>{d?.name ?? "N/A"}</div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className={movieDetailHStyles.fallbackAvatar}>?</div>
                        <div className={movieDetailHStyles.crewName}>N/A</div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Producer */}
          <div className={movieDetailHStyles.crewCard}>
            <div className={movieDetailHStyles.crewTitle}>
              <User className={movieDetailHStyles.crewIcon} />
              <h3 style={{ fontFamily: "'Cinzel', serif" }}>Producer</h3>
            </div>
            <div className={movieDetailHStyles.crewContent}>
              {(() => {
                const producer = movie.producers?.[0] || movie.producer || null;
                const raw = producer?.avatarUrl || producer?.img || producer?.image || null;
                if (raw) {
                  const src = raw.startsWith("http") ? raw : `${getApiBaseUrl()}/uploads/${raw.replace(/^\/?(uploads\/)?/, "")}`;
                  return <img src={src} alt={producer.name} loading="lazy" className={movieDetailHStyles.crewImage} onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src="https://via.placeholder.com/96?text=P"; }} />;
                }
                return <FallbackAvatar className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4" />;
              })()}
              <div className={movieDetailHStyles.crewName}>
                {(movie.producers?.[0] || movie.producer)?.name ?? "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
