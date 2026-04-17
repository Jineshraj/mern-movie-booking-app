const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[WARNING] MongoDB Connection Failed: ${error.message}`);
    console.warn(`[SYSTEM] Server will remain online, but Database-reliant calls will stall. Enable Local Mongo or provide an Atlas URI.`);
  }
};

module.exports = connectDB;
