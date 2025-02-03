// /src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { Codes, Enums, Messages } from "../enums/enums.js";


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(Enums.UNAUTHORIZED).json({
            success: Enums.FAILED,
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(Enums.FORBIDDEN).json({
            success: Enums.FAILED,
            message: 'Invalid or expired token.',
        });
    }
};

export { verifyToken }; 