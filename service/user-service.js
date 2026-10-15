
import User from "../model/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    signupSchema,
    loginSchema,
} from "../utils/request-validator.js";
import { ROLES } from "../utils/role.js";

// Generate JWT Token
const generateToken = (user) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing in .env");
    }

    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        secret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
            algorithm: "HS256",
        }
    );
};

// Signup Service
export const signupUser = async function (req, res) {
    try {
        // Validate request
        const { error, value } = signupSchema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const { fullname, email, password } = value;
        const normalizedEmail = email.trim().toLowerCase();

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create normal user only
        const createdUser = await User.create({
            fullname,
            email: normalizedEmail,
            password: hashedPassword,
            role: ROLES.USER,
        });

        // Generate JWT
        const token = generateToken(createdUser);

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
                role: createdUser.role,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        console.error("Signup error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// Login Service
export const loginUser = async function (req, res) {
    try {
        // Validate request
        const { error, value } = loginSchema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const { email, password } = value;
        const normalizedEmail = email.trim().toLowerCase();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isMatch = await bcryptjs.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Generate JWT
        const token = generateToken(user);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
