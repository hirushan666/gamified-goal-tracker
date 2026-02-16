import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import goalRoutes from "./routes/goals.js";
import progressRoutes from "./routes/progress.js";
import friendRoutes from "./routes/friends.js";
import challengeRoutes from "./routes/challenges.js";
import mongoose from "mongoose";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/challenges", challengeRoutes);

app.get("/", (req, res) => {
  res.send("Gamified Goal Tracker API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));
