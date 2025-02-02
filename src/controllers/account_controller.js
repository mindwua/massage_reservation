import {
  AccountServiceModel,
  AccountMongooseModel,
} from "../models/account_models.js";
import { ResponseModel } from "../models/response_models.js";
import { Codes, Enums, Messages } from "../enums/enums.js";
export async function createAccount(req, res) {
  try {
    const body = req.body;
    const newAccount = new AccountServiceModel(
      body.username,
      body.password,
      body.email,
      body.telephone
    );

    await AccountMongooseModel.create(newAccount);

    res.status(Enums.CREATE).json({
      status: Enums.SUCCESS,
      code: Codes.AC_001,
      message: Messages.AC_001,
      data: `${JSON.stringify(newAccount)}`,
    });
  } catch (error) {
    res.status(Enums.SERVER_ERROR).json(
      ResponseModel.create({
        status: Enums.FAILED,
        code: Codes.AC_002,
        message: Messages.AC_002,
        data: error ?? null,
      })
    );
    // throw error;
  }
}
