require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = "admin@cineverse.com";
  const user = await User.findOne({ email });
  if (user) {
    console.log("User found:");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Password hash exists:", !!user.password);
  } else {
    console.log("User not found!");
  }
  await mongoose.disconnect();
}
verify();
