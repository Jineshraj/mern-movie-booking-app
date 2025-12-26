import { Link } from "react-router-dom";
import { moviesStyles } from "../assets/dummyStyles";
import movies from "../assets/dummymoviedata";
import { Tickets } from "lucide-react";

const Movies = () => {
  const visibleMovies = movies.slice(0, 6);

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
            <Link to={`/movies/${m.id}`} className={moviesStyles.movieLink}>
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
