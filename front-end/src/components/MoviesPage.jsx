import { useEffect, useState } from "react";
import api, { getApiBaseUrl } from "../utils/api";
import { moviesPageStyles } from "../assets/dummyStyles";
import { Link } from "react-router-dom";

const MoviesPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  
  const [movies, setMovies] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAndMergeMovies = async () => {
      try {
        const { data } = await api.get('/movies');
        
        // Filter OUT featured layout items, mapping exclusively remaining components
        const normalMovies = data.filter(m => m.type !== "featured" && m.title !== "Fighter");

        const formattedLiveMovies = normalMovies.map(m => ({
          id: m._id, 
          title: m.title,
          category: (m.category && m.category[0]) ? m.category[0].toLowerCase() : "action", 
          price: m.seatPrices?.standard || 250,
          image: `${getApiBaseUrl()}/${m.posterUrl}`,
          img: `${getApiBaseUrl()}/${m.posterUrl}`,
          description: m.description,
          time: (m.showtimes || []).map(s => s.time) || ["2:30 PM", "7:00 PM"]
        }));
        
        setMovies(formattedLiveMovies);
      } catch (err) {
        console.error("Failed to load live movies", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndMergeMovies();
  }, []);
  const filteredMovies =
    activeCategory === "all"
      ? movies
      : movies.filter((movie) => movie.category === activeCategory);
      
  const COLLAPSE_COUNT = 12;
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  const visibleMovies = showAll
    ? filteredMovies
    : filteredMovies.slice(0, COLLAPSE_COUNT);

  const categories = [
    { id: "all", name: "All Movies" },
    { id: "action", name: "Action" },
    { id: "horror", name: "Horror" },
    { id: "comedy", name: "Comedy" },
    { id: "adventure", name: "Adventure" },
  ];

  return (
    <div className={moviesPageStyles.container}>
      <section className={moviesPageStyles.categoriesSection}>
        <div className={moviesPageStyles.categoriesContainer}>
          <div className={moviesPageStyles.categoriesFlex}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${moviesPageStyles.categoryButton.base} ${
                  activeCategory === category.id
                    ? moviesPageStyles.categoryButton.active
                    : moviesPageStyles.categoryButton.inactive
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className={moviesPageStyles.moviesSection}>
        <div className={moviesPageStyles.moviesContainer}>
          <div className={moviesPageStyles.moviesGrid}>
            {visibleMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className={moviesPageStyles.movieCard}
              >
                <div className={moviesPageStyles.movieImageContainer}>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className={moviesPageStyles.movieImage}
                  />
                </div>
                <div className={moviesPageStyles.movieInfo}>
                  <h3 className={moviesPageStyles.movieTitle}>{movie.title}</h3>
                  <div className={moviesPageStyles.movieCategory}>
                    <span className={moviesPageStyles.movieCategoryText}>
                      {movie.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {filteredMovies.length === 0 && (
              <div className={moviesPageStyles.emptyState}>
                No movies found in this category
              </div>
            )}
          </div>
          {filteredMovies.length > COLLAPSE_COUNT && (
            <div className={moviesPageStyles.showMoreContainer}>
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className={moviesPageStyles.showMoreButton}
              >
                {showAll
                  ? "Show Less"
                  : `Show More ${filteredMovies.length - COLLAPSE_COUNT} more`}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MoviesPage;
