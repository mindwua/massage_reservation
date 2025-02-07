import { Router } from "express";
import { bookingReservation, getReservation, deleteReservation } from "../controllers/reservation_controller.js";
// import { bookingReservation, getReservation, deleteReservation } from "../controllers/reservation_controller.js";
import { verifyToken } from "../middleware/auth.js"; // ใช้เส้นทางจาก routes ไปที่ middleware
import { validateBody, validateParam } from "../middleware/validate.js";
import { bookingSchema , deleteReservationSchema} from "../utils/joi_validator_utils.js";
import { get } from "mongoose";

const routerReservation = Router();

routerReservation.post("/booking", verifyToken, validateBody(bookingSchema), bookingReservation);
routerReservation.get("/booking", verifyToken, getReservation);
routerReservation.delete("/booking/:bookingId", verifyToken, validateParam(deleteReservationSchema), deleteReservation);


export default routerReservation;
