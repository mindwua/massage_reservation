import jwt from 'jsonwebtoken';
import { Codes, StatusCodes, StatusMessages, Messages } from "../enums/enums.js";


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(Enums.UNAUTHORIZED).json({
            status: StatusMessages.FAILED,
            code: Codes.TKN_6002,
            message: Messages.TKN_6002,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(Enums.FORBIDDEN).json({
            status: StatusMessages.FAILED,
            code: Codes.TKN_6003,
            message: Messages.TKN_6003,
        });
    }
};

export { verifyToken }; 