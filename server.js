import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import helmet from "helmet";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import footprintRoutes from "./routes/footprintRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import arcjetMiddleware from "./middleware/arcjetMiddleware.js";


const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(arcjetMiddleware);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/footprints", footprintRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to carbon footprint tracker ");
})
// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
});
