import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res, next) => {
    try {
        const { full_name, email, password, country } = req.body;
        if (!full_name && !email && !password) return res.status(400).json({ success: false, message: "All fields are required" })
        const existing = await User.findOne({ email });
        if (existing) {
            res.status(400);
            throw new Error("Email already registered");
        }

        const user = new User({ full_name, email, password_hash: password, country });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            success: true,
            message: "User Register Successfully",
            token,
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400);
            throw new Error("User not found");
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            res.status(401);
            throw new Error("Invalid password");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};
