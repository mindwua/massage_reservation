import Joi from "joi";

export const bookingSchema = Joi.object({
    date: Joi.string().min(3).max(30).required(),
    shopId: Joi.string().required(),
});


