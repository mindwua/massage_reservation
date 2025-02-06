import { Router } from "express";
import { createMassageShop, getAllMassageShops, getMassageShopById } from "../controllers/massage_shops_controller.js";
import { verifyToken } from "../middleware/auth.js";


const routerMassageShops = Router();

routerMassageShops.post("/massage-shop", verifyToken, createMassageShop);
routerMassageShops.get("/massage-shops", verifyToken, getAllMassageShops);
routerMassageShops.get("/massage-shop/:shopId", verifyToken, getMassageShopById);


export default routerMassageShops;
