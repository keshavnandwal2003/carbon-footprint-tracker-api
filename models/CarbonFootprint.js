import mongoose from "mongoose";

const breakdownSchema = new mongoose.Schema(
    {
        energy: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        flights: { type: Number, default: 0 },
        diet: { type: Number, default: 0 },
        waste: { type: Number, default: 0 },
    },
    { _id: false }
);

const carbonFootprintSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        totalFootprint: { type: Number, required: true },
        breakdown: { type: breakdownSchema, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("CarbonFootprint", carbonFootprintSchema);
