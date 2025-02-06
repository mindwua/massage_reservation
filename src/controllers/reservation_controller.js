
import { Codes, Enums, Messages } from "../enums/enums.js";
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
            parseInt(req.body.shopId)
        ) 
        const result = await validateShop(reservationModel.shopId)
        const reservation =  await ReservationMongooseModel.find({date: reservationModel.date})
        console.log(reservation)
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