import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        msg: "User already exists",
        redirect: "/login" // Indicate that user should be redirected to login
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate anonymous username
    const username = "user_" + Math.random().toString(36).substring(2, 8);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      username,
      initialAssessmentCompleted: false,
      followupAssessmentsCompleted: false
    });
    await newUser.save();

    res.json({ 
      msg: "Signup successful", 
      username, 
      userId: newUser._id,
      initialAssessmentCompleted: newUser.initialAssessmentCompleted,
      followupAssessmentsCompleted: newUser.followupAssessmentsCompleted
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
      token, 
      username: user.username, 
      userId: user._id,
      initialAssessmentCompleted: user.initialAssessmentCompleted,
      followupAssessmentsCompleted: user.followupAssessmentsCompleted
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;