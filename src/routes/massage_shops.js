import { Router } from "express";
import { createMassageShop, getAllMassageShops, getMassageShopById, deleteMassageShop, updateMassageShop } from "../controllers/massage_shops_controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";


const routerMassageShops = Router();

routerMassageShops.post("/massage-shop", verifyToken, verifyAdmin,createMassageShop);
routerMassageShops.get("/massage-shops", verifyToken,  getAllMassageShops);
routerMassageShops.get("/massage-shop/:shopId", verifyToken, getMassageShopById);
routerMassageShops.delete("/massage-shop/:shopId", verifyToken, verifyAdmin, deleteMassageShop);
routerMassageShops.put("/massage-shop/:shopId", verifyToken, verifyAdmin, updateMassageShop);


export default routerMassageShops;
