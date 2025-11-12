import mongoose from "mongoose";

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
    emission_factor: { type: Number, required: true, min: 0 },
    emission_total: { type: Number, required: true, min: 0 },
    date_recorded: { type: Date, required: true },
    notes: { type: String, trim: true, maxlength: 300 },
}, {
    timestamps: true
});

// Auto-calc emission_total
footprintSchema.pre("validate", function (next) {
    if (!this.emission_total && this.amount && this.emission_factor)
        this.emission_total = this.amount * this.emission_factor;
    next();
});

export default mongoose.model("CarbonFootprint", footprintSchema);
