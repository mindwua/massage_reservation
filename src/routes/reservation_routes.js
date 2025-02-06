import { Router } from "express";
import { bookingReservation, getReservation } from "../controllers/reservation_controller.js";
import { verifyToken } from "../middleware/auth.js"; // ใช้เส้นทางจาก routes ไปที่ middleware
import { validateBody } from "../middleware/validate.js";
import { bookingSchema } from "../utils/joi_validator_utils.js";
import { get } from "mongoose";

const routerReservation = Router();

routerReservation.post("/booking", verifyToken, validateBody(bookingSchema), bookingReservation);
routerReservation.get("/booking", verifyToken, getReservation);


export default routerReservation;
