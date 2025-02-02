import AccountSchema from "../models/account_models.js";
import { ResponseModel } from "../models/response_models.js";
export async function createAccount(req, res) {
  // const body = req.body;
  // const accountModel = new AccountModel(
  //   body.username,
  //   body.password,
  //   body.email,
  //   body.telephone
  // );
  try {
    const newAccount = await AccountSchema.create({
      username,
      password,
      email,
      telephone,
    });
  } catch {
    return res
      .status(500)
      .json(new ResponseModel(false, "AC-002", "Error creating account", null));
  }

  res.status(201).json({
    status: true,
    code: "AC-001",
    message: "Account created",
    // data: `${JSON.stringify(accountModel)}`,
  });
}
