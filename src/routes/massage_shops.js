import { Router } from "express";
import { createMassageShop } from "../controllers/massage_shops_controller.js";
import { verifyToken } from "../middleware/auth.js";


const routerMassageShops = Router();

routerMassageShops.post("/massage-shop", verifyToken, createMassageShop);

export default routerMassageShops;
