import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js"; // ✅ Make sure this exists
import workoutRoutes from "./routes/workoutRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

// ✅ Ensure location routes are registered
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes); // ✅ This must be present
app.use("/api/workouts", workoutRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { pool };
