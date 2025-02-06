import mongoose from "mongoose";

class ReservationServiceModel {
  constructor(date, shopId, userId) {
    this.date = new Date(date);
    this.shopId = shopId;
    this.userId = userId
    this.status = "Pending"
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
        bookingId: { type: String, required: true, unique: true },
        date: { type: Date, required: true },
        shopId: { type: String, required: true },
        userId: { type: String, required: true },
        status: { type: String, required: true, default: "Pending" },
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
