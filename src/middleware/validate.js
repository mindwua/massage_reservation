
import { Enums, Codes, StatusCodes, StatusMessages, Messages } from "../enums/enums.js";
import logger from "../utils/logger_utils.js";


const validateBody = (schema) => (req, res, next) => {
    try {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
             res.status(StatusCodes.BAD_REQUEST).json({
                success: StatusMessages.FAILED,
                code: Codes.VAL_4001,
                message: Messages.VAL_4001,
                data: error.details.map((err) => err.message),
            });
        }
        next();
    } catch (e) {
        logger.error(JSON.stringify(e))
        res.status(StatusCodes.BAD_REQUEST).json({
            success: StatusMessages.FAILED,
            code: Codes.VAL_4001,
            message: Messages.VAL_4001,
            data: error.details.map((err) => err.message),
        });
    }
};


export { validateBody };