import { Router } from "express";
import { loginUser, logoutUser, verifyTokenUser } from "../controllers/auth_controller.js";
import { verifyToken } from "../middleware/auth.js";
const routerAuth = Router();

routerAuth.post("/login", loginUser);
routerAuth.post("/logout", verifyToken, logoutUser);
routerAuth.get('/verifyToken', verifyToken, verifyTokenUser);



export default routerAuth;
