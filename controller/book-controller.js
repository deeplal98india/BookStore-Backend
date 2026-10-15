
import { addBook, getAllBooks, getBookById, deleteBookById } from "../service/book-service.js";
import { HttpStatus } from "../utils/http-status.js";
import {
    validate,
    bookSchema,
} from "../utils/request-validator.js";

export const createBook = async function (req, res) {
    // Validate Request
    const validationResult = await validate(
        bookSchema,
        req.body
    );

    if (!validationResult.success) {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send({ message: validationResult.message });
    }

    const { name, price, category, image, title } = req.body;

    return addBook(req, res, {
        name,
        price,
        category,
        image,
        title,
    });
};

// Get all books
export const allBooks = async function (req, res) {
    return getAllBooks(req, res);
};

// Get book by ID
export const bookFindById = async function (req, res) {
    const { id } = req.params;

    return getBookById(req, res, id);
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;

  return deleteBookById(req, res, id);
};