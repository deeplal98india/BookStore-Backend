import Joi from "joi";

// User Signup Validation
export const signupSchema = Joi.object({
    fullname: Joi.string().trim().min(3).max(100).required().messages({
        "string.base": "Full name must be a string",
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters long",
        "string.max": "Full name must not exceed 100 characters",
        "any.required": "Full name is mandatory",
    }),

    email: Joi.string().trim().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),

    password: Joi.string().min(8).max(128).required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 128 characters",
        "any.required": "Password is mandatory",
    }),
});

// User Login Validation
export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "any.required": "Password is mandatory",
    }),
});

// Book Validation
export const bookSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150).required().messages({
        "string.base": "Book name must be a string",
        "string.empty": "Book name is required",
        "string.min": "Book name must be at least 2 characters long",
        "string.max": "Book name must not exceed 150 characters",
        "any.required": "Book name is mandatory",
    }),

    title: Joi.string().trim().min(2).max(200).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title is required",
        "string.min": "Title must be at least 2 characters long",
        "string.max": "Title must not exceed 200 characters",
        "any.required": "Title is mandatory",
    }),

    price: Joi.number().positive().required().messages({
        "number.base": "Price must be a valid number",
        "number.positive": "Price must be greater than 0",
        "any.required": "Price is required",
    }),

    category: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Category must be a string",
        "string.empty": "Category is required",
        "string.min": "Category must be at least 2 characters long",
        "string.max": "Category must not exceed 100 characters",
        "any.required": "Category is mandatory",
    }),

    image: Joi.string().trim().allow("").messages({
        "string.base": "Image must be a string",
    }),
});

// Common Validation Helper
export const validate = async function (schema, data) {
    try {
        await schema.validateAsync(data, {
            abortEarly: true,
            stripUnknown: true,
        });

        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error.details[0].message,
        };
    }
};