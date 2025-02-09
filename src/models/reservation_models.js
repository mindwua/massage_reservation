import mongoose from "mongoose";
import logger from "../utils/logger_utils.js";
import {  MassageShopServiceModel } from "./massage_shop_models.js";
import { formatDate, convertDateToISO } from "../utils/date_utils.js";
import { Status } from "../enums/enums.js";
class ReservationServiceModel {
  constructor(date, shopId, userId, shopDetails , bookingId) {
    this.date = new Date(date);
    if (shopId !== null && shopId !== undefined) {
      this.shopId = shopId;
    }
    this.userId = userId;
    this.status = "Pending";
    this.bookingId = bookingId ?? this.generateBookingId() ;
    this.shopDetails = shopDetails
  }

  generateBookingId() {
    const prefix = "BKD-";
    const randomNumber = Date.now().toString().slice(-8);
    return `${prefix}${randomNumber}`;
  }



  static getSchema() {
    return new mongoose.Schema(
      {
        bookingId: { type: String, required: true },
        date: { type: Date, required: true },
        status: { type: String, required: true },
        userId: { type: String, required: true },
        shopId: { type: mongoose.Schema.Types.ObjectId, ref: "MassageShop" },
      },
      { timestamps: true }
    );
  }


  static async fetchShopDetails(shopId) {
    return await ReservationMongooseModel.findOne(
        { _id: new mongoose.Types.ObjectId(shopId) },
    );
}



static createBooking = async (reservation, startOfDay, endOfDay) => {
  try {
    const shopDetails = await MassageShopServiceModel.fetchShopDetails(reservation.shopId)
    
    const checkPendingReservations = await ReservationMongooseModel.find({
      date: { $gte: startOfDay, $lte: endOfDay } , status: Status.PENDING
    }).countDocuments();
    
    if(checkPendingReservations < 3) {
      const createdReservation =await ReservationMongooseModel.create(reservation);
      const formattedResponse = new ReservationServiceModel(
        createdReservation.date,
        createdReservation.shopId,
        createdReservation.userId,
        shopDetails
      );
      return formattedResponse;
    }


  } catch (error) {
    throw new Error(error);
  }
};


  static runAggregation = async (isAdmin , reqQuery, userId) => {
    try {
      logger.info("🔍 Running Aggregation...");
      const matchStage = {};

      if (userId && !isAdmin) matchStage.userId = userId;
      if (reqQuery?.userId && isAdmin) matchStage.userId = reqQuery.userId;
      if (reqQuery?.shopId) matchStage.shopId = reqQuery.shopId;
      if (reqQuery?.status) matchStage.status = reqQuery.status;

      logger.info(`matchStage >>>>> ${JSON.stringify(matchStage)}`);

      let results = await ReservationMongooseModel.aggregate([
        { $match: matchStage },
        {
          $addFields: {
            shopIdObject: { $toObjectId: "$shopId" },
          },
        },
        {
          $lookup: {
            from: "massage_shops",
            localField: "shopIdObject",
            foreignField: "_id",
            as: "shopDetails",
          },
        },
        {
          $unwind: "$shopDetails",
        },
        {
          $project: {
            bookingId: 1,
            date: 1,
            userId: 1,
            status: 1,
            shopId: 1,
            shopName: "$shopDetails.shopName",
            shopAddress: "$shopDetails.shopAddress",
            telephone: "$shopDetails.telephone",
            openTime: "$shopDetails.openTime",
            closeTime: "$shopDetails.closeTime",
          },
        },
      ]);
      results = results.map((reservation) => ({
        ...reservation,
        date: formatDate(reservation.date), // Convert to string format
      }));
      return results
    } catch (error) {
      throw new Error(error)
    }
  };

  static async deleteWithRole(isAdmin, userId, bookingId) {
    try {
      if(isAdmin) {
        return await ReservationMongooseModel.findOneAndDelete({ bookingId: bookingId });
      } else {
        return await ReservationMongooseModel.findOneAndDelete({ bookingId: bookingId, userId: userId });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static  async updateWithRole(isAdmin, userId, bookingId, req) {
    try {
      const matchStage = {};
      let result
      let formattedResponse
      if(req.date) matchStage.date = convertDateToISO(req.date);
      if(req.shopId) matchStage.shopId =  req.shopId;
      // if(req.status) matchStage.status = req.status;
      console.log(matchStage)
      if(isAdmin) {
         result =   await ReservationMongooseModel.findOneAndUpdate({ bookingId: bookingId }, {$set:matchStage}, );
        
      } else {
        result = await ReservationMongooseModel.findOneAndUpdate({ bookingId: bookingId, userId: userId}, {$set:matchStage}, );
      }
      if(result) {
        const shopDetails = await MassageShopServiceModel.fetchShopDetails(result.shopId)
        formattedResponse = new ReservationServiceModel(
          result.date,
          null,
          result.userId,
          shopDetails,
          result.bookingId,
        );
        return formattedResponse
      }

      return formattedResponse

    } catch (error) {
      throw new Error(error);
    }
  }


}



const ReservationMongooseModel = mongoose.model(
  "Reservation",
  ReservationServiceModel.getSchema()
);

export { ReservationServiceModel, ReservationMongooseModel };
