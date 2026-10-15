
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { ROLES } from "../utils/role.js";

// Verify JWT Token
export const jwtMiddleware = async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token missing or invalid",
            });
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("JWT_SECRET is missing in .env");

            return res.status(500).json({
                message: "Server authentication configuration error",
            });
        }

        const decoded = jwt.verify(token, secret, {
            algorithms: ["HS256"],
        });

        // Check current user and role from database
        const user = await User.findById(decoded.userId).select(
            "_id fullname email role"
        );

        if (!user) {
            return res.status(401).json({
                message: "User not found. Please login again",
            });
        }

        req.user = {
            userId: user._id.toString(),
            fullname: user.fullname,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired. Please login again",
            });
        }

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "CastError" ||
            error.name === "TypeError"
        ) {
            return res.status(401).json({
                message: "Invalid authentication token",
            });
        }

        console.error("Authentication error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// Allow only Admin
export const authorizeAdmin = function (req, res, next) {
    if (req.user?.role !== ROLES.ADMIN) {
        return res.status(403).json({
            message: "Access denied. Admin only",
        });
    }

    next();
};
