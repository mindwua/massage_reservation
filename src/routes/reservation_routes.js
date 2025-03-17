import { Router } from "express";
import { bookingReservation, getReservation, deleteReservation, updateReservation, updateStatusReservation } from "../controllers/reservation_controller.js";
import { verifyToken } from "../middleware/auth.js";
import { validateBody, validateParam } from "../middleware/validate.js";
import { bookingSchema, bookingRunningSchema, bodyPutSchema, bodyPatchSchema } from "../utils/joi_validator_utils.js";

const routerReservation = Router();

routerReservation.post("/booking", verifyToken,validateBody(bookingSchema), bookingReservation);
routerReservation.get("/booking", verifyToken, getReservation);
routerReservation.delete("/booking/:bookingId", verifyToken, validateParam(bookingRunningSchema), deleteReservation);
routerReservation.put("/booking/:bookingId", verifyToken, validateParam(bookingRunningSchema), validateBody(bodyPutSchema), updateReservation);
routerReservation.patch("/booking/:bookingId", verifyToken, validateParam(bookingRunningSchema), validateBody(bodyPatchSchema), updateStatusReservation);


export default routerReservation;
