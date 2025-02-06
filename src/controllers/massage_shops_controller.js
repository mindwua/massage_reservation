import { MassageShopServiceModel, MassageShopMongooseModel } from "../models/massage_shop_models.js";
import { ResponseModel } from "../models/response_models.js";
import { StatusCodes, StatusMessages, Codes, Messages } from "../enums/enums.js";
import mongoose from 'mongoose';

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

export async function getAllMassageShops(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        const skip = (page - 1) * limit;

        const massageShops = await MassageShopMongooseModel.find()
            .skip(skip)
            .limit(limit);

        if (!massageShops || massageShops.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusMessages.FAILED,
                message: "No massage shops found"
            });
        }

        const totalShops = await MassageShopMongooseModel.countDocuments();

        const formattedShops = massageShops.map(shop => ({
            shopId: shop._id.toString(),
            shopName: shop.shopName,
            shopAddress: shop.shopAddress,
            telephone: shop.telephone,
            openTime: shop.openTime,
            closeTime: shop.closeTime
        }));

        return res.status(StatusCodes.OK).json({
            status: StatusMessages.SUCCESS,
            count: totalShops,
            page: page,
            totalPages: Math.ceil(totalShops / limit),
            shops: formattedShops

        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            message: error.message || "An error occurred while fetching massage shops"
        });
    }
}

export async function getMassageShopById(req, res) {
    try {
        const { shopId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1004,
                message: Messages.MGS_1004,
            });
        }

        if (!shopId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.VAL_4001,
                message: "Shop ID is required"
            });
        }

        const massageShop = await MassageShopMongooseModel.findById(shopId);

        if (!massageShop) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1004,
                message: "Massage shop not found"
            });
        }

        return res.status(StatusCodes.OK).json({
            status: StatusMessages.SUCCESS,
            data: {
                shopId: massageShop._id,
                shopName: massageShop.shopName,
                shopAddress: massageShop.shopAddress,
                telephone: massageShop.telephone,
                openTime: massageShop.openTime,
                closeTime: massageShop.closeTime,
                createdAt: massageShop.createdAt,
                updatedAt: massageShop.updatedAt
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            message: error.message || Messages.SERVER_ERROR
        });
    }
}

export async function deleteMassageShop(req, res) {
    try {
        const { shopId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1004,
                message: Messages.MGS_1004,
            });
        }

        if (!shopId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.VAL_4001,
                message: Messages.VAL_4001
            });
        }

        const massageShop = await MassageShopMongooseModel.findById(shopId);

        if (!massageShop) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1004,
                message: Messages.MGS_1004
            });
        }

        await MassageShopMongooseModel.findByIdAndDelete(shopId);

        return res.status(StatusCodes.OK).json({
            status: StatusMessages.SUCCESS,
            code: Codes.MGS_1005,
            message: Messages.MGS_1001
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            message: error.message || Messages.SERVER_ERROR
        });
    }
}

export async function updateMassageShop(req, res) {
    try {
        const { shopId } = req.params;
        const { shopName, shopAddress, telephone, openTime, closeTime } = req.body;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1004,
                message: Messages.MGS_1004,
            });
        }


        if (!shopId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.VAL_4001,
                message: Messages.VAL_4001
            });
        }

        if (!shopName || !shopAddress || !telephone || !openTime || !closeTime) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.VAL_4001,
                message: Messages.VAL_4001
            });
        }

        const massageShop = await MassageShopMongooseModel.findById(shopId);

        if (!massageShop) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1004,
                message: Messages.MGS_1004
            });

        }

        const existingShop = await MassageShopMongooseModel.findOne({ shopName, _id: { $ne: shopId } });

        if (existingShop) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1002,
                message: Messages.MGS_1002
            });
        }

        // Update the shop's details
        massageShop.shopName = shopName;
        massageShop.shopAddress = shopAddress;
        massageShop.telephone = telephone;
        massageShop.openTime = openTime;
        massageShop.closeTime = closeTime;

        // Save the updated shop
        await massageShop.save();

        return res.status(StatusCodes.OK).json({
            status: StatusMessages.SUCCESS,
            code: Codes.MGS_1006,
            message: "Massage shop successfully updated",
            data: {
                shopId: massageShop._id,
                shopName: massageShop.shopName,
                shopAddress: massageShop.shopAddress,
                telephone: massageShop.telephone,
                openTime: massageShop.openTime,
                closeTime: massageShop.closeTime,
                createdAt: massageShop.createdAt,
                updatedAt: massageShop.updatedAt
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            message: error.message || "An error occurred while updating the massage shop"
        });
    }
}
