import mongoose from "mongoose";

class ReservationServiceModel {
  constructor(date, shopId, userId) {
    this.date = date;
    this.shopId = shopId;
    this.userId = userId
    this.status = "Pending"
  }

  static getSchema() {
    return new mongoose.Schema(
      {
        date: { type: String, required: true },
        shopId: { type: String, required: true },
        userId: { type: String, required: true },
        status: { type: String, required: true , default: "Pending"},
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
