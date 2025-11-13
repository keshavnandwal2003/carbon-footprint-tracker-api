import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Enter a valid email"],
    },
    password_hash: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
    },
    country: {
        type: String,
        default: "India"
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

// Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password_hash")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
});

export default mongoose.model("User", userSchema);
