import CarbonFootprint from "../models/CarbonFootprint.js";
import mongoose from "mongoose";

// ------------------------------
// Create a new footprint entry
// ------------------------------
export const addFootprint = async (req, res) => {
    try {
        const userId = req.user.id;
        const { totalFootprint, breakdown } = req.body;

        if (
            totalFootprint == null ||
            !breakdown ||
            typeof breakdown.energy !== "number" ||
            typeof breakdown.transport !== "number" ||
            typeof breakdown.flights !== "number" ||
            typeof breakdown.diet !== "number" ||
            typeof breakdown.waste !== "number"
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid footprint data.",
            });
        }

        const footprint = await CarbonFootprint.create({
            user_id: userId,
            totalFootprint,
            breakdown,
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
        const userId = req.user.id;
        const footprints = await CarbonFootprint.find({ user_id: userId }).sort({
            createdAt: -1,
        });

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
// Get total footprint summary
// ------------------------------
export const getSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const summary = await CarbonFootprint.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalFootprint: { $sum: "$totalFootprint" },
                    entries: { $sum: 1 },
                    energy: { $sum: "$breakdown.energy" },
                    transport: { $sum: "$breakdown.transport" },
                    flights: { $sum: "$breakdown.flights" },
                    diet: { $sum: "$breakdown.diet" },
                    waste: { $sum: "$breakdown.waste" },
                },
            },
        ]);

        if (summary.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    totalFootprint: 0,
                    entries: 0,
                    breakdown: { energy: 0, transport: 0, flights: 0, diet: 0, waste: 0 },
                },
            });
        }

        const s = summary[0];

        return res.status(200).json({
            success: true,
            data: {
                totalFootprint: parseFloat(s.totalFootprint.toFixed(2)),
                entries: s.entries,
                breakdown: {
                    energy: parseFloat(s.energy.toFixed(2)),
                    transport: parseFloat(s.transport.toFixed(2)),
                    flights: parseFloat(s.flights.toFixed(2)),
                    diet: parseFloat(s.diet.toFixed(2)),
                    waste: parseFloat(s.waste.toFixed(2)),
                },
            },
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
// Update an existing footprint entry
// ------------------------------
export const updateFootprint = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { totalFootprint, breakdown } = req.body;

        if (
            totalFootprint == null ||
            !breakdown ||
            typeof breakdown.energy !== "number" ||
            typeof breakdown.transport !== "number" ||
            typeof breakdown.flights !== "number" ||
            typeof breakdown.diet !== "number" ||
            typeof breakdown.waste !== "number"
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid footprint data.",
            });
        }

        const updatedFootprint = await CarbonFootprint.findOneAndUpdate(
            { _id: id, user: userId },
            { totalFootprint, breakdown },
            { new: true }
        );

        if (!updatedFootprint) {
            return res.status(404).json({
                success: false,
                message: "Footprint entry not found or unauthorized.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footprint entry updated successfully.",
            data: updatedFootprint,
        });
    } catch (error) {
        console.error("Error updating footprint:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating footprint.",
            error: error.message,
        });
    }
};

// ------------------------------
// Delete an entry
// ------------------------------
export const deleteFootprint = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const entry = await CarbonFootprint.findOneAndDelete({ _id: id, user: userId });

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
