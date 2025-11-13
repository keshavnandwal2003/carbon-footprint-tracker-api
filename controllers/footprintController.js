import CarbonFootprint from "../models/CarbonFootprint.js";
import mongoose from "mongoose";

// ------------------------------
// Create a new footprint entry
// ------------------------------
export const addFootprint = async (req, res) => {
    try {
        const userId = req.user._id; // from auth middleware (JWT)
        const {
            energyKwh,
            gasTherms,
            transportCar,
            transportBus,
            transportTrain,
            transportFlight,
            wastePeople,
        } = req.body;

        // Validate required fields
        if (
            energyKwh == null ||
            gasTherms == null ||
            transportCar == null ||
            transportBus == null ||
            transportTrain == null ||
            transportFlight == null ||
            wastePeople == null
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields: energyKwh, gasTherms, transportCar, transportBus, transportTrain, transportFlight, wastePeople.",
            });
        }

        // Create new footprint entry
        const footprint = await CarbonFootprint.create({
            user: userId,
            energyKwh,
            gasTherms,
            transportCar,
            transportBus,
            transportTrain,
            transportFlight,
            wastePeople,
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
        const footprints = await CarbonFootprint.find({ user: userId }).sort({
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
// Get a summary of totalFootprint
// ------------------------------
export const getSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const summary = await CarbonFootprint.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalFootprint: { $sum: "$totalFootprint" },
                    entries: { $sum: 1 },
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: summary.length
                ? { totalFootprint: summary[0].totalFootprint, entries: summary[0].entries }
                : { totalFootprint: 0, entries: 0 },
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
            user: userId,
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
