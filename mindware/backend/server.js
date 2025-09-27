import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
// Import routes for assessment data
import assessmentRoutes from "./routes/assessment.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ DB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assessments", assessmentRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);