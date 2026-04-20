const Movie = require("../models/movieModel");
const fs = require("fs");

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    // Basic search filtering logic
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const movies = await Movie.find({ ...keyword });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  try {
    const b = req.body;
    let posterUrl = req.files?.poster ? req.files.poster[0].path : "";
    const categories = b.categories ? JSON.parse(b.categories) : [];
    const slots = b.slots ? JSON.parse(b.slots) : [];
    const seatPrices = b.seatPrices ? JSON.parse(b.seatPrices) : { standard: 0, recliner: 0 };
    
    // Map actors, directors, producers w/ Avatar files
    let cast = b.cast ? JSON.parse(b.cast) : [];
    if (req.files?.castFiles) cast = cast.map((c, i) => ({ ...c, avatarUrl: req.files.castFiles[i]?.path || "" }));
    let directors = b.directors ? JSON.parse(b.directors) : [];
    if (req.files?.directorFiles) directors = directors.map((c, i) => ({ ...c, avatarUrl: req.files.directorFiles[i]?.path || "" }));
    let producers = b.producers ? JSON.parse(b.producers) : [];
    if (req.files?.producerFiles) producers = producers.map((c, i) => ({ ...c, avatarUrl: req.files.producerFiles[i]?.path || "" }));
    const movie = await Movie.create({
      title: b.movieName, type: b.type || "normal", description: b.story || "", duration: Number(b.duration) || 0,
      category: categories, posterUrl, trailerUrl: b.trailerUrl || "", videoUrl: b.videoUrl || "",
      rating: Number(b.rating) || 7.5, seatPrices, auditorium: b.auditorium || "Audi 1",
      cast, directors, producers, showtimes: slots, latestTrailer: b.latestTrailer ? JSON.parse(b.latestTrailer) : {}
    });
    res.status(201).json(movie);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      // Physical delete logic for images
      if (movie.posterUrl && fs.existsSync(movie.posterUrl)) {
        fs.unlinkSync(movie.posterUrl);
      }

      if (movie.cast && movie.cast.length > 0) {
        movie.cast.forEach((actor) => {
          if (actor.avatarUrl && fs.existsSync(actor.avatarUrl)) {
            fs.unlinkSync(actor.avatarUrl);
          }
        });
      }

      await movie.deleteOne();
      res.json({ message: "Movie removed" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
};
