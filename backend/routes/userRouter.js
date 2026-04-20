const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
} = require("../controllers/userController");
const { protect, adminProtect } = require("../middleware/auth");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/", protect, adminProtect, getAllUsers);

module.exports = router;
