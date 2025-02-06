import mongoose from "mongoose";
import { Codes, StatusCodes, StatusMessages, Messages } from "../enums/enums.js";


class MassageShopServiceModel {
  constructor(shopName, shopAddress, telephone, openTime, closeTime) {
    this.shopName = shopName;
    this.shopAddress = shopAddress;
    this.telephone = telephone;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }

  static getSchema() {
    return new mongoose.Schema(
      {
        shopName: { type: String, required: true },
        shopAddress: { type: String, required: true },
        telephone: {
          type: String,
          required: true,
          match: [/^\+?[0-9]{7,15}$/, Messages.VL]
        },
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
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
