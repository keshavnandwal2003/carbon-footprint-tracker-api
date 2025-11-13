import CarbonFootprint from "../models/CarbonFootprint.js";
import mongoose from "mongoose";

// ------------------------------
// Create a new footprint entry
// ------------------------------
export const addFootprint = async (req, res) => {
    try {
        const userId = req.user._id; // from auth middleware (JWT)
        const { category, activity_name, amount, unit, date_recorded, notes } = req.body;

        if (!category || !activity_name || !amount || !unit) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields (category, activity_name, amount, unit).",
            });
        }

        const footprint = await CarbonFootprint.create({
            user_id: userId,
            category,
            activity_name,
            amount,
            unit,
            date_recorded,
            notes,
        });

        return res.status(201).json({
            success: true,
            message: "Footprint entry created successfully.",
            data: footprint,
        });
    } catch (error) {
        console.error("Error adding footprint:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while adding footprint.",
            error: error.message,
        });
    }
};

// ------------------------------
// Get all entries for logged-in user
// ------------------------------
export const getUserFootprints = async (req, res) => {
    try {
        const userId = req.user._id;
        const footprints = await CarbonFootprint.find({ user_id: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: footprints.length,
            data: footprints,
        });
    } catch (error) {
        console.error("Error fetching footprints:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching footprints.",
            error: error.message,
        });
    }
};

// ------------------------------
// Get a summary by category (for dashboard charts)
// ------------------------------
export const getSummaryByCategory = async (req, res) => {
    try {
        const userId = req.user._id;

        const summary = await CarbonFootprint.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$category",
                    total_emission: { $sum: "$emission_total" },
                    entries: { $sum: 1 },
                },
            },
            { $sort: { total_emission: -1 } },
        ]);

        return res.status(200).json({
            success: true,
            data: summary.map((item) => ({
                category: item._id,
                total_emission: item.total_emission,
                entries: item.entries,
            })),
        });
    } catch (error) {
        console.error("Error generating summary:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while generating summary.",
            error: error.message,
        });
    }
};

// ------------------------------
// Delete an entry
// ------------------------------
export const deleteFootprint = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const entry = await CarbonFootprint.findOneAndDelete({
            _id: id,
            user_id: userId,
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Footprint entry not found or unauthorized.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footprint entry deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting footprint:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting footprint.",
            error: error.message,
        });
    }
};
