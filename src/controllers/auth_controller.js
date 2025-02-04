import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AccountMongooseModel } from "../models/account_models.js";
import { Codes, StatusCodes, StatusMessages, Messages } from "../enums/enums.js";

export async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusMessages.FAILED,
            code: Codes.VAL_4001,
            message: Messages.VAL_4001
        });
    }

    try {
        const user = await AccountMongooseModel.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusMessages.FAILED,
                code: Codes.LGN_2003,
                message: Messages.LGN_2003
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusMessages.FAILED,
                code: Codes.LGN_2002,
                message: Messages.LGN_2002
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION }
        );

        return res.status(StatusCodes.OK).json({
            status: StatusMessages.SUCCESS,
            code: Codes.LGN_2001,
            message: Messages.LGN_2001,
            data: {
                token,
                userId: user._id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(StatusMessages.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            message: StatusMessages.SERVER_ERROR,
        });
    }
}

export const logoutUser = (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });

        res.status(StatusCodes.OK).json({
            status: StatusMessages.SUCCESS,
            code: Codes.LOT_5001,
            message: Messages.LOT_5001,
        });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            message: StatusMessages.SERVER_ERROR,
        });
    }
};

export const verifyTokenHandler = (req, res) => {
    res.status(StatusCodes.OK).json({
        status: StatusMessages.FAILED,
        code: Codes.TKN_6001,
        message: Messages.TKN_6001,
    });
};

