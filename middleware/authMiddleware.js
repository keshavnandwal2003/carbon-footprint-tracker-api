import jwt from "jsonwebtoken";
import CarbonFootprint from "../models/CarbonFootprint.js";

export const protect = (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id }; // user id from token
            next();
        } catch (err) {
            return res.status(401).json({ message: "Not authorized" });
        }
    } else {
        return res.status(401).json({ message: "No token provided" });
    }
};
