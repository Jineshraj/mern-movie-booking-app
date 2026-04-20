// Run once: node seedAdmin.js
// Creates an admin user if one doesn't already exist
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB Atlas");

  const email = "admin@cineverse.com";
  const existing = await User.findOne({ email });

  if (existing) {
    // Ensure role is admin AND update password to be sure
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("Admin@1234", salt);
    existing.role = "admin";
    existing.password = hashed;
    await existing.save();
    console.log("✅ Existing user updated to admin and password reset:", email);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("Admin@1234", salt);
    await User.create({
      fullName: "CineVerse Admin",
      email,
      password: hashed,
      role: "admin",
    });
    console.log("✅ Admin user created:", email);
  }

  console.log("   Email:    admin@cineverse.com");
  console.log("   Password: Admin@1234");
  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
