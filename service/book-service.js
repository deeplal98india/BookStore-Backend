
import Book from "../model/Book.js";
import { HttpStatus } from "../utils/http-status.js";

// Create book
export const addBook = async function (req, res, bookData) {
    const book = await Book.create({
        name: bookData.name,
        price: bookData.price,
        category: bookData.category,
        image: bookData.image,
        title: bookData.title,
    });

    return res.status(HttpStatus.CREATED).send({
        message: "Book created successfully",
        data: book,
    });
};

// Get all books
export const getAllBooks = async function (req, res) {
    try {
        const books = await Book.find().sort({ _id: -1 });

        return res.status(HttpStatus.OK).send({
            data: books,
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: error.message,
        });
    }
};

// Get book by ID
export const getBookById = async function (req, res, id) {
    try {
        const book = await Book.findById(id);

        if (!book) {
            return res.status(HttpStatus.NOT_FOUND).send({
                message: "Book not found",
            });
        }

        return res.status(HttpStatus.OK).send({
            data: book,
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: error.message,
        });
    }
};


export const deleteBookById = async function (req, res, id) {
  try {
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Book not found",
      });
    }

    return res.status(HttpStatus.OK).send({
      message: "Book deleted successfully",
      data: book,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: "Invalid book ID",
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message,
    });
  }
};