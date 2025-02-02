import { Router } from "express";
import { createAccount } from "../controllers/account_controller.js";
const routerAccount = Router();

routerAccount.route("/").post(createAccount);

export default routerAccount;
