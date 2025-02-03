import { Codes, Enums, Messages } from "../enums/enums.js";
import { ReservationMongooseModel, ReservationServiceModel } from "../models/account_models copy.js";
import logger from "../utils/logger_utils.js";

export async function bookingReservation(req, res) {
    try {
        const reservation = new ReservationServiceModel(
            req.body.shopId,
            req.body.date
        )
        await ReservationMongooseModel.create(reservation)
        res.status(Enums.OK).json({
            status: Enums.SUCCESS,
            code: Codes.RS_009,
            message: Messages.RS_009,
            data: {}
        });
    } catch (e) {
        logger.error(e)
        res.status(Enums.SERVER_ERROR).json({
            status: Enums.FAILED,
            code: Codes.RS_010,
            message: Messages.RS_010,
        });
    }

}