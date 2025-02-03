import { AccountServiceModel, AccountMongooseModel } from "../models/account_models.js";
import { ResponseModel } from "../models/response_models.js";
import { Codes, Enums, Messages } from "../enums/enums.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hideEmail = (email) => {
  const [localPart, domainPart] = email.split('@');
  const hiddenLocalPart = localPart.slice(0, 2) + '*'.repeat(localPart.length - 2);
  return `${hiddenLocalPart}@${domainPart}`;
};


const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
const LINE_ACCESS_TOKEN = 'ef8e17e7e364153ff55d4db0b2ac6f6b';  // Replace with your actual LINE access token

const sendLineMessage = async (userName, userEmail, userTelephone) => {
  try {
    const message = {
      to: 'USER_LINE_ID', // Replace with the user LINE ID to send message
      messages: [
        {
          type: 'text',
          text: `Hello ${userName}, your account with email ${userEmail} and telephone ${userTelephone} has been created successfully!`,
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
    };

    // Send POST request to LINE API
    await axios.post(LINE_API_URL, message, { headers });
  } catch (error) {
    console.error('Error sending LINE message:', error.message);
  }
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
    await sendLineMessage(newAccount.name, newAccount.email, newAccount.telephone);


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


export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(Enums.BAD_REQUEST).json({
      status: Enums.FAILED,
      code: Codes.AC_002,
      message: Messages.AC_002,

    });
  }

  try {
    const user = await AccountMongooseModel.findOne({ email });
    if (!user) {
      return res.status(Enums.UNAUTHORIZED).json({
        success: false,
        errorCode: "AC_003",
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(Enums.UNAUTHORIZED).json({
        success: false,
        errorCode: "AC_003",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    return res.status(200).json({
      success: Enums.SUCCESS,
      code: Codes.LG_008,
      message: Messages.LG_008,
      data: {
        token,
        userId: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(Enums.SERVER_ERROR).json({
      success: Messages.FAILED,
      errorCode: "SERVER_ERROR",
      message: "Server error",
    });
  }
}
