import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password_hash");
            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }
            next();
        } catch (error) {
            res.status(401);
            next(new Error("Invalid or expired token"));
        }
    } else {
        res.status(401);
        next(new Error("No token provided"));
    }
};
