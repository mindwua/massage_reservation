import mongoose from "mongoose";

class ReservationServiceModel {
  constructor(date, shopId) {
    this.date = date;
    this.shopId = shopId;
  }

  static getSchema() {
    return new mongoose.Schema(
      {
        date: { type: String, required: true },
        shopId: { type: String, required: true },
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
