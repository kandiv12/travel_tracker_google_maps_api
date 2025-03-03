import express from "express";
import {
  getLocations,
  addLocation,
} from "../controllers/locationController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fetch locations for logged-in user
router.get("/", authenticateToken, getLocations);

// ✅ Add a new location
router.post("/", authenticateToken, addLocation);

export default router;
