import { Router } from "express";
import { createAccount } from "../controllers/account_controller.js";

const routerAccount = Router();

routerAccount.post("/register", createAccount);
// routerAccount.post("/login", loginUser);
// routerAccount.post("/logout", verifyToken, logoutUser);


// routerAccount.route("/verifyToken")
//     .get(verifyToken, (req, res) => {
//         res.status(200).json({
//             success: "success",
//             message: "Token is valid",
//         });
//     });


export default routerAccount;
