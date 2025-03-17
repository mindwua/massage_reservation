
import { Codes, Enums, Messages, StatusCodes, StatusMessages } from "../enums/enums.js";
import { ReservationMongooseModel, ReservationServiceModel } from "../models/reservation_models.js";
import { MassageShopMongooseModel, MassageShopServiceModel } from "../models/massage_shop_models.js";
import logger from "../utils/logger_utils.js";
import { sendSlackMessage } from "../utils/slack.js";
import { convertDateToISO, rangeDate } from "../utils/date_utils.js";
import { AccountMongooseModel, AccountServiceModel } from "../models/account_models.js";

async function validateShop(shopId) {
  try {
    const found = await MassageShopMongooseModel.find({ shopId: shopId });
    if (found) {
      return true;
    }
    return false;
  } catch (e) {
    throw new Error("Shop not found");
  }
}

export async function bookingReservation(req, res) {
  try {
    let exist
    const formattedDate = convertDateToISO(req.body.date);
    const { startOfDay, endOfDay } = rangeDate(formattedDate);
    let reservationModel = {}
    if (req.user.isAdmin == true) {
      reservationModel = new ReservationServiceModel(
        formattedDate,
        req.body.shopId,
        req.body.user
      );
    } else {
      reservationModel = new ReservationServiceModel(
        formattedDate,
        req.body.shopId,
        req.user.userId
      );
    }


    const result = await validateShop(reservationModel.shopId);


    if (result) {
      const result = await ReservationServiceModel.createBooking(
        reservationModel,
        startOfDay,
        endOfDay
      );
      if (!result) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusMessages.FAILED,
          code: Codes.RSV_3004,
          message: Messages.RSV_3004,
        });
      }
      logger.info("Reservation created successfully");
      res.status(StatusCodes.OK).json({
        status: StatusMessages.SUCCESS,
        code: Codes.RSV_3001,
        message: Messages.RSV_3001,
        data: result,
      });
      sendSlackMessage(result, req.user)
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        status: StatusMessages.FAILED,
        code: Codes.RSV_3003,
        message: Messages.RSV_3003,
      });
    }
  } catch (e) {
    logger.error(e);
    res.status(StatusCodes.SERVER_ERROR).json({
      status: StatusMessages.FAILED,
      code: Codes.GNR_1001,
      message: Messages.GNR_1001,
    });
  }
}

export async function getReservation(req, res) {
  try {
    let result;
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;

    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 50;
    const skip = (page - 1) * limit;

    if (isAdmin) {
      if (req.query) {
        result = await ReservationServiceModel.runAggregation(
          isAdmin,
          req.query,
          userId,
          skip,
          limit
        );
      } else {
        result = await ReservationServiceModel.runAggregation(isAdmin);
      }
    } else {
      if (req.query) {
        result = await ReservationServiceModel.runAggregation(
          isAdmin,
          req.query,
          userId,
          skip,
          limit
        );
      } else {
        result = await ReservationServiceModel.runAggregation(
          isAdmin,
          null,
          userId,
          skip,
          limit
        );
      }
    }
    res.status(StatusCodes.OK).json({
      status: StatusMessages.SUCCESS,
      code: Codes.RSV_3005,
      count: result.length,
      page: page,
      totalPages: Math.ceil(result.length / limit) == 0 ? 1 : Math.ceil(result.length / limit),
      message: Messages.RSV_3005,
      data: result,
    });
  } catch (e) {
    logger.error(e);
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
    const { isAdmin, userId } = req.user;
    logger.info(`bookingId >>>> ${bookingId}`);
    const reseration = await ReservationServiceModel.deleteWithRole(
      isAdmin,
      userId,
      bookingId
    );
    if (!reseration) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusMessages.FAILED,
        code: Codes.RSV_3007,
        message: Messages.RSV_3007,
      });
    }
    return res.status(StatusCodes.OK).json({
      status: StatusMessages.SUCCESS,
      code: Codes.RSV_3008,
      message: Messages.RSV_3008,
    });
  } catch (e) {
    logger.error(e);
    res.status(StatusCodes.SERVER_ERROR).json({
      status: StatusMessages.FAILED,
      code: Codes.GNR_1001,
      message: Messages.GNR_1001,
    });
  }
}

export async function updateReservation(req, res) {
  try {
    const { bookingId } = req.params;
    const { isAdmin, userId } = req.user;
    logger.info(`bookingId >>>> ${bookingId}`);
    const result = await ReservationServiceModel.updateWithRole(
      isAdmin,
      userId,
      bookingId,
      req.body
    );
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusMessages.FAILED,
        code: Codes.RSV_3009,
        message: Messages.RSV_3009,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: StatusMessages.SUCCESS,
      code: Codes.RSV_3010,
      message: Messages.RSV_3010,
      data: result,
    });
  } catch (e) {
    logger.error(e);
    res.status(StatusCodes.SERVER_ERROR).json({
      status: StatusMessages.FAILED,
      code: Codes.GNR_1001,
      message: Messages.GNR_1001,
    });
  }
}

export async function updateStatusReservation(req, res) {
  try {
    const { bookingId } = req.params;
    const { isAdmin, userId } = req.user;
    logger.info(`bookingId >>>> ${bookingId}`);

    const result = await ReservationServiceModel.updateStatusWithRole(
      isAdmin,
      userId,
      bookingId,
      req.body
    );

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusMessages.FAILED,
        code: Codes.RSV_3009,
        message: Messages.RSV_3009,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: StatusMessages.SUCCESS,
      code: Codes.RSV_3010,
      message: Messages.RSV_3010,
      data: result,
    });
  } catch (e) {
    logger.error(e);
    return res.status(StatusCodes.SERVER_ERROR).json({
      status: StatusMessages.FAILED,
      code: Codes.GNR_1001,
      message: Messages.GNR_1001,
    });
  }
}
