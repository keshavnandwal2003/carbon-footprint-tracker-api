import express from "express";
import {
    addFootprint,
    getUserFootprints,
    getUserMonthlyTotal,
} from "../controllers/footprintController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addFootprint);
router.get("/:userId", protect, getUserFootprints);
router.get("/:userId/summary", protect, getUserMonthlyTotal);

export default router;
