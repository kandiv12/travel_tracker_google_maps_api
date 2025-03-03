import { pool } from "../index.js";

/* 📌 Fetch User Locations */
export const getLocations = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM locations WHERE user_id = $1",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch Locations Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* 📌 Add a New Location */
export const addLocation = async (req, res) => {
  const { name, latitude, longitude } = req.body;
  const userId = req.user.userId;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO locations (name, latitude, longitude, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name || "Workout Location", latitude, longitude, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Insert Location Error:", err);
    res.status(500).json({ error: "Failed to add location" });
  }
};
