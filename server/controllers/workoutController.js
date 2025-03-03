import { pool } from "../index.js";

/* 📌 Fetch User Workouts */
export const getWorkouts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM workouts WHERE user_id = $1",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch Workouts Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* 📌 Add a New Workout */
export const addWorkout = async (req, res) => {
  const { workout_type, duration, calories_burned, location_id } = req.body;
  const userId = req.user.userId;

  if (!workout_type || !duration || !calories_burned) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO workouts (user_id, workout_type, duration, calories_burned, location_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, workout_type, duration, calories_burned, location_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Insert Workout Error:", err);
    res.status(500).json({ error: "Failed to add workout" });
  }
};
