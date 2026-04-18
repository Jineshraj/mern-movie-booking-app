import { Link } from "react-router-dom";
import { releasesStyles } from "../assets/dummyStyles";
import movies from "../assets/dummyrdata";

const ReleasedPage = () => {
  return (
    <div className={releasesStyles.pageContainer}>
      <div className={releasesStyles.headerContainer}>
        <h1 className={releasesStyles.headerTitle}>RELEASES SOON</h1>
        <p className={releasesStyles.headerSubtitle}>
          Latest Movies • Now Showing
        </p>
      </div>
      <div className={releasesStyles.movieGrid}>
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className={releasesStyles.movieCard}
            style={{ textDecoration: "none" }}
          >
            <div className={releasesStyles.imageContainer}>
              <img
                src={movie.image}
                alt={movie.title}
                className={releasesStyles.movieImage}
              />
            </div>
            <div className={releasesStyles.movieInfo}>
              <h3 className={releasesStyles.movieTitle}>{movie.title}</h3>
              <p className={releasesStyles.movieCategory}>{movie.category}</p>
              <p style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "4px" }}>
                {movie.releaseDate || "Coming Soon"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReleasedPage;
