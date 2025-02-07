
import { Codes, Enums, Messages, StatusCodes, StatusMessages } from "../enums/enums.js";
import { ReservationMongooseModel, ReservationServiceModel } from "../models/reservation_models.js";
import { MassageShopMongooseModel } from "../models/massage_shop_models.js";
import logger from "../utils/logger_utils.js";
import mongoose from 'mongoose';

async function validateShop(shopId) {
    try {
        const found = await MassageShopMongooseModel.find({ shopId: shopId })
        if (found) {
            return true
        }
        return false
    }catch (e) {
        throw new Error("Shop not found")
    }

}

function convertDateToISO(dateStr) {
    const [day, month, year] = dateStr.split(" ")[0].split("-");
    const [hour, minute] = dateStr.split(" ")[1].split(":");

    const isoString = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;

    const date = new Date(isoString);
    if (isNaN(date)) {
        throw new Error("Invalid date format");
    }

    return date.toISOString();
}

// async function checkPendingReservations(shopId, userId) {
//     const pendingCount = await ReservationMongooseModel.countDocuments({
//         shopId: shopId,
//         userId: userId,
//         status: "Pending"
//     });

//     return pendingCount < 3;
// }


async function checkPendingReservationsForDate(shopId, userId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const pendingCount = await ReservationMongooseModel.countDocuments({
        shopId: shopId,
        userId: userId,
        status: "Pending",
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    return pendingCount < 3;
}


export async function bookingReservation(req, res) {
    try {

        const formattedDate = convertDateToISO(req.body.date);
        const reservationModel = new ReservationServiceModel(
            formattedDate,
            req.body.shopId,
            req.user.userId
        );

        const result = await validateShop(reservationModel.shopId)

        // if (result) {

        // const canBook = await checkPendingReservations(reservationModel.shopId, reservationModel.userId);
        // if (!canBook) {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         status: StatusMessages.FAILED,
        //         code: Codes.RSV_3002,
        //         message: "User has too many pending reservations"
        //     });
        // }

        if (result) {
            const canBook = await checkPendingReservationsForDate(reservationModel.shopId, reservationModel.userId, formattedDate);
            if (!canBook) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: StatusMessages.FAILED,
                    code: Codes.RSV_3004,
                    message: Messages.RSV_3004
                });
            }
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
                code: Codes.RSV_3003,
                message: Messages.RSV_3003,
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

export async function getReservation(req, res) {
    try {
        console.log(req.user)
        let result
        const userId =  req.user.userId
        const isAdmin = req.user.isAdmin
        if (isAdmin) {
            if (req.query.userId || req.query.shopId || req.query.status) {
                 result = await ReservationServiceModel.runAggregation(isAdmin, req.query, userId)
                
            } else {
                 result = await  ReservationServiceModel.runAggregation(isAdmin)
            }
        } else {
            if (req.query.shopId || req.query.statu) {
                 result = await ReservationServiceModel.runAggregation(isAdmin, req.query, userId)
             } else {
                 result = await  ReservationServiceModel.runAggregation(isAdmin, null, userId)
             }
        }
        res.status(StatusCodes.OK).json({
            status: StatusMessages.SUCCESS,
            code: Codes.RSV_3005,
            message: Messages.RSV_3005,
            data: result
        });

    }catch (e) {
        logger.error(e)
        res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            code: Codes.GNR_1001,
            message: Messages.GNR_1001,
        });
    }
}

export async function deleteReservation(req, res) {
    try {      
          const { bookingId } = req.params;
        logger.info(`bookingId >>>> ${bookingId}`)
            const reseration = await ReservationMongooseModel.findOneAndDelete({ bookingId: bookingId});
            if (!reseration) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: StatusMessages.FAILED,
                    code: Codes.RSV_3007,
                    message: Messages.RSV_3007
                });
            }

    
            return res.status(StatusCodes.OK).json({
                status: StatusMessages.SUCCESS,
                code: Codes.RSV_3008,
                message: Messages.RSV_3008
            });

    } catch (e) {
        logger.error(e)
        res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            code: Codes.GNR_1001,
            message: Messages.GNR_1001,
        });
    }
}