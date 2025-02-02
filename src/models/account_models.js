import mongoose from "mongoose";

class AccountServiceModel {
  constructor(username, password, email, telephone) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.telephone = telephone;
  }

  static getSchema() {
    return new mongoose.Schema(
      {
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        telephone: { type: String, required: true },
      },
      { timestamps: true }
    );
  }
}

const AccountMongooseModel = mongoose.model(
  "Account",
  AccountServiceModel.getSchema()
);

export { AccountServiceModel, AccountMongooseModel };
