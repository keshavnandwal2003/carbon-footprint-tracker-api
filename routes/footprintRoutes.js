import express from "express";
import {
    addFootprint,
    getUserFootprints,
    getSummaryByCategory,
    deleteFootprint,
} from "../controllers/footprintController.js";
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", protect, addFootprint);
router.get("/", protect, getUserFootprints);
router.get("/summary", protect, getSummaryByCategory);
router.delete("/:id", protect, deleteFootprint);

export default router;
