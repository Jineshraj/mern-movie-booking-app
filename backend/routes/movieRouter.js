const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
} = require("../controllers/movieController");
const { protect, adminProtect } = require("../middleware/auth");

// Multer Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.route("/").get(getMovies).post(
  protect,
  adminProtect,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "castAvatars", maxCount: 10 },
  ]),
  createMovie
);

router
  .route("/:id")
  .get(getMovieById)
  .delete(protect, adminProtect, deleteMovie);

module.exports = router;
