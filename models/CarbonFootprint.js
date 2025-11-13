import mongoose from "mongoose";

const carbonFootprintSchema = new mongoose.Schema(
    {
        energyKwh: { type: Number, min: 0, default: 0 },
        gasTherms: { type: Number, min: 0, default: 0 },

        transportCar: { type: Number, min: 0, default: 0 },
        transportBus: { type: Number, min: 0, default: 0 },
        transportTrain: { type: Number, min: 0, default: 0 },

        transportFlight: { type: Number, min: 0, default: 0 },

        diet: {
            type: String,
            enum: ["omnivore", "vegetarian", "vegan"],
            default: "omnivore",

        },

        wastePeople: { type: Number, min: 1, default: 1 },

        totalFootprint: { type: Number, default: 0 },

        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

carbonFootprintSchema.pre("save", function (next) {
    // Realistic emission factors
    const EF = {
        electricity: 0.7132,    // kg CO₂e per kWh (India estimate)  
        gas: 5.3,               // kg CO₂e per therm (US EPA)  
        car: 0.44,              // kg CO₂e per mile  
        bus: 0.33,              // kg CO₂e per passenger mile  
        train: 0.080,           // kg CO₂e per mile  
        flight: 0.254,          // kg CO₂e per mile (you can choose a value)  
        diet: {
            dietOmnivore: 14.0,   // kg CO₂e per person per week (example)  
            dietVegetarian: 8.0,
            dietVegan: 6.0
        },
        waste: 21.0             // kg CO₂e per person per month (example)  
    };

    const weeksPerMonth = 4.33;

    const energyFootprint =
        this.energyKwh * EF.electricity +
        this.gasTherms * EF.gas;

    const transportFootprint =
        this.transportCar * EF.car * weeksPerMonth +
        this.transportBus * EF.bus * weeksPerMonth +
        this.transportTrain * EF.train * weeksPerMonth +
        this.transportFlight * EF.flight;

    const dietFootprint = EF.diet[this.diet] * weeksPerMonth;

    const wasteFootprint = EF.waste * this.wastePeople;

    this.totalFootprint =
        energyFootprint + transportFootprint + dietFootprint + wasteFootprint;

    next();
});

const CarbonFootprint = mongoose.model("CarbonFootprint", carbonFootprintSchema);
export default CarbonFootprint;
