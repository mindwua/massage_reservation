import Joi from "joi";

// Define the schema
export const bookingSchema = Joi.object({
    shopId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/) // Validate MongoDB ObjectId (24 hex characters)
        .required(),
    date: Joi.date()
        .min('now') // Ensures the date is today or in the future
        .required()
});
