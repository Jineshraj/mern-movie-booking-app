const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files securely
app.use("/uploads", express.static("uploads"));

const userRouter = require("./routes/userRouter");
const movieRouter = require("./routes/movieRouter");
const bookingRouter = require("./routes/bookingRouter");

// Routes
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/bookings", bookingRouter);

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
