import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Account", AccountSchema);
