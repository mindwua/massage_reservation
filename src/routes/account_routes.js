import { Router } from "express";
import { createAccount, loginUser } from "../controllers/account_controller.js";
import { verifyToken } from "../middleware/auth.js"; // ใช้เส้นทางจาก routes ไปที่ middleware

const routerAccount = Router();




routerAccount.post("/register", createAccount);
routerAccount.post("/login", loginUser);

routerAccount.route("/verifyToken")
    .get(verifyToken, (req, res) => {
        res.status(200).json({
            success: "success",
            message: "Token is valid",
        });
    });


export default routerAccount;
