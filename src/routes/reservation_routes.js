import { Router } from "express";
import { bookingReservation } from "../controllers/reservation_controller.js";
import { verifyToken } from "../middleware/auth.js"; // ใช้เส้นทางจาก routes ไปที่ middleware

const routerReservation = Router();

routerReservation.post("/booking", verifyToken, bookingReservation);


export default routerReservation;
