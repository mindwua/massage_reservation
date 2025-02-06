import mongoose from "mongoose";
import logger from "../utils/logger_utils.js";
class ReservationServiceModel {
  constructor(date, shopId, userId) {
    this.date = new Date(date);
    this.shopId = shopId;
    this.userId = userId;
    this.status = "Pending";
    this.bookingId = this.generateBookingId();
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

  static runAggregation = async (isAdmin , reqQuery, userId) => {
    try {
      logger.info("🔍 Running Aggregation...");
      console.log(reqQuery)
      console.log('===')
      const matchStage = {};

      if (userId && !isAdmin) matchStage.userId = userId;
      if (reqQuery?.userId && isAdmin) matchStage.userId = reqQuery.userId;
      if (reqQuery?.shopId) matchStage.shopId = reqQuery.shopId;
      if (reqQuery?.status) matchStage.status = reqQuery.status;

      logger.info(`matchStage >>>>> ${JSON.stringify(matchStage)}`);

      const results = await ReservationMongooseModel.aggregate([
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

      console.log("Aggregation Results:", results.length);
      return results
    } catch (error) {
      throw new Error(error)
    }
  };
}

const ReservationMongooseModel = mongoose.model(
  "Reservation",
  ReservationServiceModel.getSchema()
);

export { ReservationServiceModel, ReservationMongooseModel };
