import mongoose from "mongoose";

class ReservationServiceModel {
  constructor({date, shopId, userId}) {
    this.date = date;
    this.shopId = shopId;
    this.userId = userId
  }

  static getSchema() {
    return new mongoose.Schema(
      {
        date: { type: Date, required: true },
        shopId: { type: String, required: true },
        userId: { type: String, required: true },
      },
      { timestamps: true }
    );
  }
}

const ReservationMongooseModel = mongoose.model(
  "Reservation",
  ReservationServiceModel.getSchema()
);

export { ReservationServiceModel, ReservationMongooseModel };
