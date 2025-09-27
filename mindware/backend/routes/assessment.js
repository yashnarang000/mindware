import express from "express";
import User from "../models/User.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const assessmentData = require("../../src/data/data.json");

const router = express.Router();

// Helper function to calculate assessment scores and severity
const calculateScoreAndSeverity = (assessmentType, answers) => {
  try {
    // For initial assessment, we don't calculate a score
    if (assessmentType === "initial") {
      return { score: null, severity: null };
    }
    
    // Get the assessment definition
    const assessment = assessmentData.assessments[assessmentType];
    if (!assessment) {
      return { score: null, severity: null };
    }
    
    let score = 0;
    const reverseScoredItems = assessment.scoring.reverse_scored_items || [];
    
    // Calculate score based on answers
    for (const [questionId, answerValue] of Object.entries(answers.data.answers || answers.data)) {
      // Convert answer value to integer
      const value = parseInt(answerValue);
      if (!isNaN(value)) {
        // Handle reverse scored items
        const questionIndex = parseInt(questionId);
        if (reverseScoredItems.includes(questionIndex)) {
          // For reverse scored items, we need to reverse the score
          // Assuming 0-3 scale for most assessments, reverse would be 3-value
          // For 0-4 scale (PSS-10), reverse would be 4-value
          // For 0-5 scale (WHO-5), reverse would be 5-value
          let maxScore = 3; // default
          if (assessmentType === "PSS-10") maxScore = 4;
          if (assessmentType === "WHO-5") maxScore = 5;
          
          score += (maxScore - value);
        } else {
          score += value;
        }
      }
    }
    
    // Determine severity based on score
    let severity = "Unknown";
    const severityLevels = assessment.scoring.severity || {};
    
    // Find the appropriate severity level
    for (const [range, level] of Object.entries(severityLevels)) {
      const [min, max] = range.split("-").map(Number);
      if (score >= min && score <= max) {
        severity = level;
        break;
      }
    }
    
    return { score, severity };
  } catch (error) {
    console.error("Error calculating score:", error);
    return { score: null, severity: null };
  }
};

// Save initial assessment answers
router.post("/initial", async (req, res) => {
  try {
    const { userId, answers } = req.body;
    
    // Calculate score and severity (null for initial assessment)
    const { score, severity } = calculateScoreAndSeverity("initial", { data: answers });
    
    // Update user with initial assessment answers
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { answers: { type: "initial", data: answers, score, severity, date: new Date() } },
        initialAssessmentCompleted: true
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({ msg: "Initial assessment saved", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Save follow-up assessment answers
router.post("/followup", async (req, res) => {
  try {
    const { userId, assessmentType, answers } = req.body;
    
    // Calculate score and severity for the assessment
    const { score, severity } = calculateScoreAndSeverity(assessmentType, { data: answers });
    
    // Update user with follow-up assessment answers
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { answers: { type: assessmentType, data: answers, score, severity, date: new Date() } },
        followupAssessmentsCompleted: true
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({ 
      msg: "Follow-up assessment saved", 
      user,
      score,
      severity
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get user assessments
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        initialAssessmentCompleted: user.initialAssessmentCompleted,
        followupAssessmentsCompleted: user.followupAssessmentsCompleted,
        createdAt: user.createdAt
      },
      assessments: user.answers 
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;