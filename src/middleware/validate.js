
import { Codes, Enums, Messages } from "../enums/enums.js";
import { bookingSchema } from "../utils/joi_validator_utils.js";


const validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(Enums.BAD_REQUEST).json({
            success: Enums.FAILED,
            code: Codes.VL_011,
            message: Messages.VL_011,
            data: error.details.map((err) => err.message),
        });
    }
    next();
};


export { validateBody };