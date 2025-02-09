import { Router } from "express";
import { bookingReservation, getReservation, deleteReservation,updateReservation } from "../controllers/reservation_controller.js";
// import { bookingReservation, getReservation, deleteReservation } from "../controllers/reservation_controller.js";
import { verifyToken } from "../middleware/auth.js"; // ใช้เส้นทางจาก routes ไปที่ middleware
import { validateBody, validateParam } from "../middleware/validate.js";
import { bookingSchema , bookingRunningSchema, bodyPutSchema} from "../utils/joi_validator_utils.js";

const routerReservation = Router();

routerReservation.post("/booking", verifyToken, validateBody(bookingSchema), bookingReservation);
routerReservation.get("/booking", verifyToken, getReservation);
routerReservation.delete("/booking/:bookingId", verifyToken, validateParam(bookingRunningSchema), deleteReservation);
routerReservation.put("/booking/:bookingId", verifyToken, validateParam(bookingRunningSchema), validateBody(bodyPutSchema) , updateReservation);


export default routerReservation;
