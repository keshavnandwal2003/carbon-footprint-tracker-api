import express from "express";
import {
    addFootprint,
    getUserFootprints,
    getSummary,
    deleteFootprint,
} from "../controllers/footprintController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new footprint entry
router.post("/", protect, addFootprint);

// Get all footprints for logged-in user
router.get("/", protect, getUserFootprints);

// Get total footprint summary for logged-in user
router.get("/summary", protect, getSummary);

// Delete a footprint entry by ID
router.delete("/:id", protect, deleteFootprint);

export default router;
