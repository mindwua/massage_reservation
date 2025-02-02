import { AccountServiceModel, AccountMongooseModel } from "../models/account_models.js";
import { ResponseModel } from "../models/response_models.js";
import { Codes, Enums, Messages } from "../enums/enums.js";
import bcrypt from 'bcrypt';

const hideEmail = (email) => {
  const [localPart, domainPart] = email.split('@');
  const hiddenLocalPart = localPart.slice(0, 2) + '*'.repeat(localPart.length - 2);
  return `${hiddenLocalPart}@${domainPart}`;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const telephoneRegex = /^[0-9]{10}$/;
const nameRegex = /^[A-Za-zก-ฮะๆ-๏\s]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;


export async function createAccount(req, res) {
  try {
    const body = req.body;

    if (!body.name || !body.password || !body.email || !body.telephone) {
      return res.status(Enums.BAD_REQUEST).json({
        status: Enums.FAILED,
        code: Codes.AC_002,
        message: Messages.AC_002,

      });
    }

    if (!nameRegex.test(body.name)) {
      return res.status(Enums.BAD_REQUEST).json({
        status: Enums.FAILED,
        code: Codes.AC_003,
        message: Messages.AC_003 + ": " + body.name,

      });
    }

    if (!passwordRegex.test(body.password)) {
      return res.status(Enums.BAD_REQUEST).json({
        status: Enums.FAILED,
        code: Codes.AC_006,
        message: Messages.AC_006,

      });
    }


    if (!telephoneRegex.test(body.telephone)) {
      return res.status(Enums.BAD_REQUEST).json({
        status: Enums.FAILED,
        code: Codes.AC_003,
        message: Messages.AC_003 + ": " + body.telephone,

      });
    }

    if (!emailRegex.test(body.email)) {
      return res.status(Enums.BAD_REQUEST).json({
        status: Enums.FAILED,
        code: Codes.AC_003,
        message: Messages.AC_003 + ": " + body.email,

      });

    }
    const existingEmail = await AccountMongooseModel.findOne({ email: body.email });
    if (existingEmail) {
      return res.status(Enums.BAD_REQUEST).json({
        status: Enums.FAILED,
        code: Codes.AC_005,
        message: Messages.AC_005,

      });
    }

    const existingName = await AccountMongooseModel.findOne({ name: body.name });
    if (existingName) {
      return res.status(Enums.BAD_REQUEST).json({
        status: Enums.FAILED,
        code: Codes.AC_004,
        message: Messages.AC_004,

      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const hiddenEmail = hideEmail(body.email);

    const newAccount = new AccountServiceModel(
      body.name,
      hashedPassword,
      body.email,
      body.telephone
    );

    await AccountMongooseModel.create(newAccount);

    res.status(Enums.CREATE).json({
      status: Enums.SUCCESS,
      code: Codes.AC_001,
      message: Messages.AC_001,
      data: {
        name: newAccount.name,
        email: hiddenEmail,
        telephone: newAccount.telephone,
        password: hashedPassword
      }

    });

  } catch (error) {
    console.error(error);
    res.status(Enums.SERVER_ERROR).json(
      ResponseModel.create({
        status: Enums.FAILED,
        code: Codes.AC_002,
        message: Messages.AC_002,
        data: error.message ?? null,
      })
    );
  }
}
