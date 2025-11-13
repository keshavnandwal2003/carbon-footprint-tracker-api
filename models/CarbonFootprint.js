import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const footprintSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        enum: [
            "transport",
            "energy",
            "food",
            "waste",
            "water",
            "shopping",
            "digital",
            "home",
            "travel",
            "offsets",
            "other",
        ],
        required: true,
    },
    activity_name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    emission_factor: { type: Number, min: 0 },
    emission_total: { type: Number, min: 0 },
    date_recorded: { type: Date, default: Date.now },
    notes: { type: String, trim: true, maxlength: 300 },
}, {
    timestamps: true,
});

// Load emission factors only once
const emissionFactorsPath = path.join(process.cwd(), "data", "emissionFactors.json");
const emissionFactors = JSON.parse(fs.readFileSync(emissionFactorsPath, "utf-8"));

// Pre-validate hook to auto-calculate emission factor + total
footprintSchema.pre("validate", function (next) {
    const categoryData = emissionFactors[this.category];
    if (categoryData) {
        const factor =
            categoryData[this.activity_name?.toLowerCase()] ??
            categoryData["default"] ??
            1.0;
        this.emission_factor = factor;
        this.emission_total = this.amount * factor;
    } else {
        // fallback
        this.emission_factor = 1.0;
        this.emission_total = this.amount;
    }
    next();
});

export default mongoose.model("CarbonFootprint", footprintSchema);
