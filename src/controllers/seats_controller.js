import { SeatMongooseModel } from "../models/seats_modeles.js";
import { FlightMongooseModel } from "../models/flights_modeles.js";

export async function createSeat(req, res) {
    try {
        const { flightNumber, seatNumber, seatClass, price } = req.body;

        if (!flightNumber || !seatNumber || !seatClass || price === undefined) {
            return res.status(400).json({
                status: "FAILED",
                message: "Missing required fields."
            });
        }

        const flight = await FlightMongooseModel.findOne({ flightNumber });
        if (!flight) {
            return res.status(404).json({
                status: "FAILED",
                message: "Flight not found."
            });
        }

        const existingSeat = await SeatMongooseModel.findOne({ flightId: flight._id, seatNumber });

        if (existingSeat) {
            return res.status(400).json({
                status: "FAILED",
                message: "Seat number already exists for this flight."
            });
        }

        const flightId = flight._id;
        const newSeat = new SeatMongooseModel({
            flightId,
            seatNumber,
            seatClass,
            price,
        });

        await newSeat.save();

        res.status(200).json({
            status: "SUCCESS",
            message: "Seat created successfully.",
            data: newSeat
        });

    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message || "Internal Server Error"
        });
    }
}

export async function updateSeat(req, res) {
    try {
        const { _id } = req.params;
        const { seatClass, price } = req.body;

        if (!seatClass || price === undefined) {
            return res.status(400).json({
                status: "FAILED",
                message: "Missing required fields: seatClass or price."
            });
        }

        const seat = await SeatMongooseModel.findById(_id);
        if (!seat) {
            return res.status(404).json({
                status: "FAILED",
                message: "Seat not found."
            });
        }

        if (req.body.seatNumber || req.body.flightId) {
            return res.status(400).json({
                status: "FAILED",
                message: "You cannot update seatNumber or flightId."
            });
        }

        seat.seatClass = seatClass;
        seat.price = price;
        await seat.save();

        res.status(200).json({
            status: "SUCCESS",
            message: "Seat updated successfully.",
            data: seat
        });

    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message || "Internal Server Error"
        });
    }
}


export async function deleteSeat(req, res) {
    try {
        const { _id } = req.params;

        const seat = await SeatMongooseModel.findByIdAndDelete(_id);

        if (!seat) {
            return res.status(404).json({
                status: "FAILED",
                message: "Seat not found."
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Seat deleted successfully.",
            data: seat
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message || "Internal Server Error"
        });
    }
}


export async function getAllSeats(req, res) {
    try {
        const { flightNumber } = req.query;

        let filter = {};

        if (flightNumber) {
            const flight = await FlightMongooseModel.findOne({ flightNumber });
            if (flight) {
                filter.flightId = flight._id;
            } else {
                return res.status(404).json({
                    status: "FAILED",
                    message: "Flight not found."
                });
            }
        }

        const seats = await SeatMongooseModel.find(filter);

        if (!seats.length) {
            return res.status(404).json({
                status: "FAILED",
                message: "No seats found matching the criteria."
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Seats retrieved successfully.",
            data: seats,
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message || "Internal Server Error"
        });
    }
}


export async function getSeatById(req, res) {
    try {
        const { _id } = req.params;

        const seat = await SeatMongooseModel.findById(_id);

        if (!seat) {
            return res.status(404).json({
                status: "FAILED",
                message: "Seat not found."
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Seat retrieved successfully.",
            data: seat
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message || "Internal Server Error"
        });
    }
}
