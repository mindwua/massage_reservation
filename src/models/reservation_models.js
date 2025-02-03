import mongoose from "mongoose";

class ReservationServiceModel {
  constructor(shopId, shopName, shopAddress, telephone, openTime, closeTime) {
    this.shopId = shopId;
    this.shopName = shopName;
    this.shopAddress = shopAddress;
    this.telephone = telephone;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }

  static getSchema() {
    return new mongoose.Schema(
      {
        shopId: { type: String, required: true },
        shopName: { type: String, required: true },
        shopAddress: { type: String, required: true },
        telephone: { type: String, required: true },
        openTime: { type: Boolean, default: false },
        closeTime: { type: Boolean, default: false },
      },
      { timestamps: true }
    );
  }
}

const ReservationMongooseModel = mongoose.model(
  "Account",
  ReservationServiceModel.getSchema()
);

export { ReservationServiceModel, ReservationMongooseModel };
