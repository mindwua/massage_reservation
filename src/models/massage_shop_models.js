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

  static async fetchShopDetails(shopId) {
    try {
      const shopDetails = await MassageShopMongooseModel.findOne(
        { _id: new mongoose.Types.ObjectId(shopId) },
        { _id: 1, shopName: 1, shopAddress: 1, telephone: 1, openTime: 1, closeTime: 1 } // Projection to fetch only required fields
      );
      return shopDetails
    }catch(e) {
      throw new Error('Shop not found')
    }
  }
}

const MassageShopMongooseModel = mongoose.model(
  "Massage_Shop",
  MassageShopServiceModel.getSchema()
);

export { MassageShopServiceModel, MassageShopMongooseModel };
