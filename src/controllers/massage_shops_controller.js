import { MassageShopServiceModel, MassageShopMongooseModel } from "../models/massage_shop_models.js";
import { ResponseModel } from "../models/response_models.js";
import { StatusCodes, StatusMessages, Codes, Messages } from "../enums/enums.js";

export async function createMassageShop(req, res) {
    try {
        const { shopName, shopAddress, telephone, openTime, closeTime } = req.body;

        if (!shopName || !shopAddress || !telephone || !openTime || !closeTime) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.VAL_4001,
                message: Messages.VAL_4001
            });
        }

        if (!req.user || req.user.isAdmin !== true) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1003,
                message: Messages.MGS_1003,
            });
        }

        const existingShop = await MassageShopMongooseModel.findOne({ shopName });
        if (existingShop) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1002,
                message: Messages.MGS_1002
            });
        }

        const newMassageShop = new MassageShopMongooseModel({
            shopName,
            shopAddress,
            telephone,
            openTime,
            closeTime
        });

        await newMassageShop.save();

        res.status(StatusCodes.CREATE).json({
            status: StatusMessages.SUCCESS,
            code: Codes.MGS_1001,
            message: Messages.MGS_1001,
            data: {
                shopId: newMassageShop._id,
                shopName: newMassageShop.shopName,
                shopAddress: newMassageShop.shopAddress,
                telephone: newMassageShop.telephone,
                openTime: newMassageShop.openTime,
                closeTime: newMassageShop.closeTime,
                createdAt: newMassageShop.createdAt,
                updatedAt: newMassageShop.updatedAt,
            }
        });

    } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            message: error.message || StatusMessages.SERVER_ERROR
        });

    }
}
