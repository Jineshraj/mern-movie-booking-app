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
    const {
      title,
      description,
      duration,
      releaseDate,
      language,
      category,
      trailerUrl,
      basePrice,
    } = req.body;

    // Handle poster
    let posterUrl = "";
    if (req.files && req.files.poster && req.files.poster.length > 0) {
      posterUrl = req.files.poster[0].path;
    }

    // Handle parsed Cast Array since it comes as stringified JSON in formData
    let cast = [];
    if (req.body.cast) {
      cast = JSON.parse(req.body.cast);
      // Map cast avatars
      if (req.files && req.files.castAvatars) {
        cast = cast.map((actor, index) => {
          return {
            ...actor,
            avatarUrl: req.files.castAvatars[index]
              ? req.files.castAvatars[index].path
              : "",
          };
        });
      }
    }

    // Handle Showtimes
    let showtimes = [];
    if (req.body.showtimes) {
      showtimes = JSON.parse(req.body.showtimes);
    }

    const movie = await Movie.create({
      title,
      description,
      duration,
      releaseDate,
      language,
      category,
      posterUrl,
      trailerUrl,
      basePrice,
      cast,
      showtimes,
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
