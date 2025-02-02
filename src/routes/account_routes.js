const express = require("express");
const { createAccount } = require("../controllers/account_controller");
const routerAccount = express.Router();

routerAccount.route("/").post(createAccount);

module.exports = routerAccount;
