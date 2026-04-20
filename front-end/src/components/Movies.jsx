import { Link } from "react-router-dom";
import { moviesStyles } from "../assets/dummyStyles";
import api, { getApiBaseUrl } from "../utils/api";
import { Tickets } from "lucide-react";
import { useState, useEffect } from "react";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/movies');
        // Filter out the specific featured movies mapping to the legacy Home layout
        const featured = data.filter(m => m.type === "featured" || m.title === "Fighter").slice(0, 6);
        setMovies(featured.map(m => ({
          id: m._id,
          title: m.title,
          category: (m.category && m.category[0]) || "action",
          img: `${getApiBaseUrl()}/${m.posterUrl}`,
        })));
      } catch (err) {
        console.error("Failed to load featured movies", err);
      }
    };
    fetchFeatured();
  }, []);

  const visibleMovies = movies;

  return (
    <section className={moviesStyles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&display=swap');
      `}</style>
      <h2
        className={moviesStyles.title}
        style={{ fontFamily: "'Dancing Script' , cursive" }}
      >
        Featured Movies
      </h2>
      <div className={moviesStyles.grid}>
        {visibleMovies.map((m) => (
          <article key={m.id} className={moviesStyles.movieArticle}>
            <Link to={`/movie/${m.id}`} className={moviesStyles.movieLink}>
              <img
                src={m.img}
                alt={m.title}
                loading="lazy"
                className={moviesStyles.movieImage}
              ></img>
            </Link>
            <div className={moviesStyles.movieInfo}>
              <div className={moviesStyles.titleContainer}>
                <Tickets className={moviesStyles.ticketsIcon} />
                <span
                  id={`movie-title-${m.id}`}
                  className={moviesStyles.movieTitle}
                >
                  {m.title}
                </span>
              </div>
              <div className={moviesStyles.categoryContainer}>
                <span className={moviesStyles.categoryText}>{m.category}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Movies;
