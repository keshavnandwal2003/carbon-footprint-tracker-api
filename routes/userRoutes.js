import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);

export default router;
