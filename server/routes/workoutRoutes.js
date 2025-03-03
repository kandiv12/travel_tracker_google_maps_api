import express from "express";
import { getWorkouts, addWorkout } from "../controllers/workoutController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getWorkouts); // ✅ Fetch workouts for logged-in user
router.post("/", authenticateToken, addWorkout); // ✅ Add a new workout

export default router;
