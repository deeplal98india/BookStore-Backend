import express from "express";
import {
    createBook,
    allBooks,
    bookFindById,
    deleteBook
} from "../controller/book-controller.js";

import {
    jwtMiddleware,
    authorizeAdmin,
} from "../middleware/middleware.js";

const router = express.Router();

// Create book - Admin only
router.post("/", jwtMiddleware, authorizeAdmin, createBook);

// Get all books
router.get("/", jwtMiddleware, allBooks);

// Get book by ID
router.get("/:id", jwtMiddleware, bookFindById);

// Delete book - Admin only
router.delete("/:id", jwtMiddleware, authorizeAdmin, deleteBook);



export default router;