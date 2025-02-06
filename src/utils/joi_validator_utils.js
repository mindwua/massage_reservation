import Joi from "joi";

// Define the schema
export const bookingSchema = Joi.object({
    shopId: Joi.string()
        .regex(/^[0-9]{24}$/) // Validate MongoDB ObjectId (24 hex characters)
        .required()
        .messages({
            "string.pattern.base": "Invalid shopId format. Must be a valid ObjectId.",
            "any.required": "shopId is required.",
        }),

    date: Joi.date()
        .min('now') // Ensures the date is today or in the future
        .required()
        .messages({
            "date.base": "Invalid date format. Must be a valid date.",
            "date.min": "Date must be today or in the future.",
            "any.required": "Date is required.",
        }),
});
