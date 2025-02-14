import { ReservationServiceModel, ReservationMongooseModel } from "../models/reservation_models.js";
import { FlightMongooseModel } from "../models/flights_modeles.js";
import { SeatMongooseModel } from "../models/seats_modeles.js";
import { Codes, StatusCodes, StatusMessages, Messages } from "../enums/enums.js";


export async function createReservation(req, res) {
    try {
        const { flightId, seatId, userId } = req.body;

        if (!flightId || !seatId || !userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.RSV_3001,
                message: Messages.RSV_3001
            });
        }

        if (!Array.isArray(seatId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.RSV_3002,
                message: Messages.RSV_3002
            });
        }

        if (new Set(seatId).size !== seatId.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.RSV_3003,
                message: Messages.RSV_3003
            });
        }

        const flight = await FlightMongooseModel.findById(flightId);
        if (!flight) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusMessages.FAILED,
                code: Codes.RSV_3004,
                message: Messages.RSV_3004
            });
        }

        const seats = await SeatMongooseModel.find({ _id: { $in: seatId } }).lean();


        const foundSeatIds = seats.map(seat => seat._id.toString());

        // const missingSeatIds = seatId.filter(id => id && !foundSeatIds.includes(id));

        // if (missingSeatIds.length > 0) {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         status: StatusMessages.FAILED,
        //         code: Codes.RSV_3006,
        //         message: `Seats not found: ${missingSeatIds.join(", ")}`
        //     });
        // }

        const destination = flight.destination;
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        const bookingReference = `${destination}-${randomDigits}`;

        const newReservation = new ReservationMongooseModel({
            flightId,
            seatId,
            userId,
            bookingReference,
        });

        const savedReservation = await newReservation.save();
        res.status(StatusCodes.CREATE).json({
            status: StatusMessages.SUCCESS,
            code: Codes.RSV_3007,
            message: Messages.RSV_3007,
            data: {
                transactionId: savedReservation._id,
                bookingReference: savedReservation.bookingReference,
                userId: savedReservation.userId,
                paymentStatus: savedReservation.paymentStatus,
                createdAt: savedReservation.createdAt,
                flightNumber: flight.flightNumber,
                seatNumbers: seats.map(seat => seat.seatNumber)
            }
        });

    } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
            status: StatusMessages.FAILED,
            message: StatusMessages.SERVER_ERROR,
        });
    }
}

export async function getAllReservations(req, res) {
    try {
        const email = req.query.email; // รับค่า email จาก query parameter

        // ดึงข้อมูลทั้งหมดจากฐานข้อมูล
        const reservations = email
            ? await ReservationServiceModel.getReservationsByEmail(email) // กรณีมี email ก็ใช้ฟังก์ชันที่กรองตาม email
            : await ReservationServiceModel.getAllReservations(); // ถ้าไม่มี email ก็ดึงข้อมูลทั้งหมด

        // กรองข้อมูลจาก reservations โดยตรวจสอบ email ใน account
        const filteredReservations = reservations.filter(reservation => {
            return reservation.account?.email === email; // ตรวจสอบ email ที่ตรงกันในแต่ละ reservation
        });


        const data = reservations.map(reservation => {
            return {
                flightNumber: reservation.flightNumber || reservation.flight?.flightNumber,
                origin: reservation.origin || reservation.flight?.origin,
                destination: reservation.destination || reservation.flight?.destination,
                departureTime: reservation.departureTime || reservation.flight?.departureTime,
                arrivalTime: reservation.arrivalTime || reservation.flight?.arrivalTime,
                reservationId: reservation._id || reservation.reservationId,
                paymentStatus: reservation.paymentStatus,
                bookingReference: reservation.bookingReference,
                createdAt: reservation.createdAt,
                name: reservation.account?.name,
                email: reservation.account?.email,
                seats: reservation.seats,
                totalPrice: reservation.totalPrice
            };
        });

        res.status(StatusCodes.OK).json({
            status: StatusMessages.SUCCESS,
            code: Codes.RSV_3009,
            message: Messages.RSV_3009,
            data
        });

        console.log(data);
    } catch (error) {
        console.error('Error fetching reservations:', error.message);
        console.error(error);
    }
}