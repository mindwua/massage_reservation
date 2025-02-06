import mongoose from "mongoose";

class MassageShopServiceModel {
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
        openTime: { type: String, default: false },
        closeTime: { type: String, default: false },
      },
      { timestamps: true }
    );
  }
}

const MassageShopMongooseModel = mongoose.model(
  "Massage_Shop",
  MassageShopServiceModel.getSchema()
);

export { MassageShopServiceModel, MassageShopMongooseModel };
