import Joi from "joi";

export const bookingSchema = Joi.object({
    shopId: Joi.string().required(),
    date: Joi.date().required(),
});


