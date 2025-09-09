const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "gafygfy6316327dsahd";

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= SIGNIN =================
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= LOGOUT =================
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully. Please remove token on client side." });
});

module.exports = router;
