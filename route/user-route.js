import express from "express";
import {
    signup,
    login,
} from "../controller/user-controller.js";
import { jwtMiddleware } from "../middleware/middleware.js";

const router = express.Router();

// Signup API
router.post("/signup", signup);

// Login API
router.post("/login", login);

// Protected Profile API
router.get("/profile", jwtMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Token verified successfully",
        user: req.user,
    });
});

export default router;