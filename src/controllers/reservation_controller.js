
import { Codes, Enums, Messages, StatusCodes, StatusMessages } from "../enums/enums.js";
import { ReservationMongooseModel, ReservationServiceModel } from "../models/reservation_models.js";
import { MassageShopMongooseModel } from "../models/massage_shop_models.js";
import logger from "../utils/logger_utils.js";

async function validateShop(shopId) {
    const found =  MassageShopMongooseModel.findOne({shopId: shopId})
    if (found) {
        return true
    } 
    throw new Error("Shop not found")
}

export async function bookingReservation(req, res) {
    try {
        const reservationModel = new ReservationServiceModel(
            req.body.date,
            req.body.shopId,
            req.user.userId
        ) 
        const result = await validateShop(reservationModel.shopId)

        if (result) {
            await ReservationMongooseModel.create(reservationModel)
            logger.info("Reservation created successfully")
            logger.info(req.body.date)
            res.status(StatusCodes.OK).json({
                status: StatusMessages.SUCCESS,
                code: Codes.RSV_3001,
                message: Messages.RSV_3001,
                data: {}
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: StatusMessages.FAILED,
                code: Codes.RSV_3001,
                message: Messages.RSV_3001,
            });
        }
   
    } catch (e) {
        logger.error(e)
        res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            code: Codes.GNR_1001,
            message: Messages.GNR_1001,
        });
    }

}