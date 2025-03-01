import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = "your_secret_key"; // Replace this with a strong secret key

app.get("/", (req, res) => {
  res.send("🚀 Welcome to the Travel Tracker API! Use /api for API routes.");
});

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

/* 📌 Middleware: Authenticate User */
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid Token" });
    req.user = user;
    next();
  });
};

/* 📌 Register New User */
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* 📌 Login User */
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* 📌 Get Current User */
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error("User Fetch Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* 📌 Fetch Locations for Logged-in User */
app.get("/api/locations", authenticateToken, async (req, res) => {
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
});

/* 📌 Add a New Location */
app.post("/api/locations", authenticateToken, async (req, res) => {
  const { name, latitude, longitude } = req.body;
  const userId = req.user.userId;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO locations (name, latitude, longitude, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, latitude, longitude, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Insert Location Error:", err);
    res.status(500).json({ error: "Failed to add location" });
  }
});

/* 📌 Delete a Location */
app.delete("/api/locations/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "DELETE FROM locations WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Location not found or unauthorized" });
    }

    res.json({ message: "Location deleted successfully" });
  } catch (err) {
    console.error("Delete Location Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* 📌 Start Express Server */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
