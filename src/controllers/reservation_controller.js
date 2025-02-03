
import { Codes, Enums, Messages } from "../enums/enums.js";
import { ReservationMongooseModel, ReservationServiceModel } from "../models/account_models copy.js";
import { MassageShopMongooseModel } from "../models/massage_shop_models.js";
import logger from "../utils/logger_utils.js";

export async function bookingReservation(req, res) {
    try {
        const reservation = new ReservationServiceModel(
            req.body.date,
            parseInt(req.body.shopId)
        ) 
        const result = await MassageShopMongooseModel.findOne({shopId: reservation.shopId})
        if (result) {
            await ReservationMongooseModel.create(reservation)
            res.status(Enums.OK).json({
                status: Enums.SUCCESS,
                code: Codes.RS_009,
                message: Messages.RS_009,
                data: {}
            });
        } else {
            res.status(Enums.NOT_FOUND).json({
                status: Enums.FAILED,
                code: Codes.RS_011,
                message: Messages.RS_011,
            });
        }
   
    } catch (e) {
        logger.error(e)
        res.status(Enums.SERVER_ERROR).json({
            status: Enums.FAILED,
            code: Codes.RS_010,
            message: Messages.RS_010,
        });
    }

}