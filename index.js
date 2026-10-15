import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcryptjs from "bcryptjs";

import bookRoute from "./route/book-route.js";
import userRoute from "./route/user-route.js";
import User from "./model/User.js";
import { ROLES } from "./utils/role.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;
const URI = process.env.MongoDBURI;

// Health check route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "BookStore API is running",
    });
});

// API routes
app.use("/book", bookRoute);
app.use("/user", userRoute);

// Create initial Admin
const createAdmin = async () => {
    const fullname = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!fullname || !email || !password) {
        throw new Error(
            "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be configured in .env"
        );
    }

    if (password.length < 12) {
        throw new Error(
            "ADMIN_PASSWORD must be at least 12 characters long"
        );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (existingUser.role !== ROLES.ADMIN) {
            throw new Error(
                "ADMIN_EMAIL already belongs to a non-admin user. Use a separate admin email."
            );
        }

        console.log("Admin account already exists");
        return;
    }

    // Prevent creating another Admin through this bootstrap
    const existingAdmin = await User.findOne({
        role: ROLES.ADMIN,
    });

    if (existingAdmin) {
        throw new Error(
            "An Admin already exists. A second Admin will not be created."
        );
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    await User.create({
        fullname,
        email,
        password: hashedPassword,
        role: ROLES.ADMIN,
    });

    console.log("Initial Admin created successfully");
};

// Connect MongoDB and start server
const startServer = async () => {
    try {
        if (!URI) {
            throw new Error("MongoDBURI is missing in .env file");
        }

        await mongoose.connect(URI);

        console.log("Connected to MongoDB Atlas");

        await createAdmin();

        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();