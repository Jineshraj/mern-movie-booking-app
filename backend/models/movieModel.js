const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    language: { type: String, required: true },
    category: { type: String, required: true },
    posterUrl: { type: String, required: true }, // Stored via Multer
    trailerUrl: { type: String, required: true }, // YouTube embedded link
    basePrice: { type: Number, required: true },
    
    // Nested arrays for Cast
    cast: [
      {
        name: { type: String },
        role: { type: String },
        avatarUrl: { type: String } // Stored via Multer
      }
    ],

    // Nested array for Showtimes
    showtimes: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true },
        bookedSeats: [{ type: String }] // Array of locked seat IDs (e.g. 'A1', 'B3')
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
