
import { Codes, Enums, Messages, StatusCodes, StatusMessages } from "../enums/enums.js";
import { ReservationMongooseModel, ReservationServiceModel } from "../models/reservation_models.js";
import { MassageShopMongooseModel } from "../models/massage_shop_models.js";
import logger from "../utils/logger_utils.js";

async function validateShop(shopId) {
    logger.info(`shopId >>>> ${shopId}`)
    const found =  await MassageShopMongooseModel.findOne({_id: shopId})
    if (found) {
        logger.info(`validate shop >>> ${JSON.stringify(found)}`)
        return found
    } 
    throw Error(Messages.RSV_3001)
}


export async function bookingReservation(req, res) {
    try {
        logger.info(`userId >>> ${req.user.userId}`)
        const reservationModel = new ReservationServiceModel({  
            date: req.body.date,
            shopId: req.body.shopId,
            userId: req.user.userId}
        )
        const result = await validateShop(reservationModel.shopId)
        // const reservation =  await ReservationMongooseModel.find({date: reservationModel.date})
        if (result) {
            await ReservationMongooseModel.create(reservationModel)
            res.status(StatusCodes.OK).json({
                status: StatusMessages.SUCCESS,
                code: Codes.RSV_3001,
                message: Messages.RS_009,
                data: result
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: StatusMessages.FAILED,
                code: Codes.RSV_3003,
                message: Messages.RSV_3003,
            });
        }
   
    } catch (e) {
        logger.error(e)
        res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            code: Codes.RSV_3002,
            message: Messages.RSV_3002,
        });
    }

}