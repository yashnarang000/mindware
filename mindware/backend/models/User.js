import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  type: String, // 'initial', 'PHQ-9', 'GAD-7', etc.
  data: mongoose.Schema.Types.Mixed, // Store assessment answers
  score: { type: Number, default: null }, // Store calculated score
  severity: { type: String, default: null }, // Store severity level (e.g., "Mild Depression")
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true }, // anonymous username
  answers: [assessmentSchema], // store assessment answers with type, score, and date
  initialAssessmentCompleted: { type: Boolean, default: false },
  followupAssessmentsCompleted: { type: Boolean, default: false }
}, {
  timestamps: true // Add createdAt and updatedAt fields
});

export default mongoose.model("User", userSchema);