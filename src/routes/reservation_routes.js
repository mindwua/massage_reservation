import { Router } from "express";
import { bookingReservation } from "../controllers/reservation_controller.js";
import { verifyToken } from "../middleware/auth.js"; // ใช้เส้นทางจาก routes ไปที่ middleware
import { validateBody } from "../middleware/validate.js";
import { bookingSchema } from "../utils/joi_validator_utils.js";

const routerReservation = Router();

routerReservation.post("/booking", verifyToken, validateBody(bookingSchema), bookingReservation);


export default routerReservation;
