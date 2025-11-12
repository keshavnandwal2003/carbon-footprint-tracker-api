import CarbonFootprint from "../models/CarbonFootprint.js";
import mongoose from "mongoose";

export const addFootprint = async (req, res, next) => {
    try {
        const footprint = new CarbonFootprint(req.body);
        await footprint.save();
        res.status(201).json({ success: true, data: footprint });
    } catch (err) {
        next(err);
    }
};

export const getUserFootprints = async (req, res, next) => {
    try {
        const footprints = await CarbonFootprint.find({ user_id: req.params.userId });
        res.json({ success: true, data: footprints });
    } catch (err) {
        next(err);
    }
};

export const getUserMonthlyTotal = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);
        const result = await CarbonFootprint.aggregate([
            { $match: { user_id: userId } },
            {
                $group: {
                    _id: { year: { $year: "$date_recorded" }, month: { $month: "$date_recorded" } },
                    total_emissions: { $sum: "$emission_total" },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
        ]);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};
