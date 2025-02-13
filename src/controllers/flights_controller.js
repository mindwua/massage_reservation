import { FlightServiceModel, FlightMongooseModel } from "../models/flights_modeles.js";

import { Codes, StatusCodes, StatusMessages, Messages } from "../enums/enums.js";

export async function createFlight(req, res) {
    try {
        const { flightNumber, origin, destination, departureTime, arrivalTime } = req.body;

        if (!flightNumber || !origin || !destination || !departureTime || !arrivalTime) {
            return res.status(400).json({ message: "Missing required flight fields." });
        }

        if (!req.user || req.user.isAdmin !== true) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusMessages.FAILED,
                code: Codes.MGS_1003,
                message: Messages.MGS_1003,
            });
        }

        const existingFlight = await FlightMongooseModel.findOne({ flightNumber });
        if (existingFlight) {
            return res.status(400).json({
                status: "FAILED",
                message: "Flight number already exists"
            });
        }

        const newFlight = new FlightMongooseModel(req.body);
        await newFlight.save();

        return res.status(201).json({
            message: "Flight created successfully",
            flight: newFlight,
        });
    } catch (error) {
        console.error("Error creating flight:", error);
        return res.status(500).json({
            message: "Failed to create flight",
            error: error.message,
        });
    }
}


export async function updateFlight(req, res) {
    try {
        const { flightNumber } = req.params;
        const { origin, destination, departureTime, arrivalTime } = req.body;

        const flight = await FlightMongooseModel.findOne({ flightNumber });

        if (!flight) {
            return res.status(404).json({
                status: "FAILED",
                message: "Flight not found"
            });
        }

        flight.origin = origin || flight.origin;
        flight.destination = destination || flight.destination;
        flight.departureTime = departureTime || flight.departureTime;
        flight.arrivalTime = arrivalTime || flight.arrivalTime;


        await flight.save();
        return res.status(200).json({
            status: "SUCCESS",
            message: "Flight updated successfully",
            data: flight
        });

    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            message: error.message || "Internal server error"
        });
    }
}

export async function getAllFlights(req, res) {
    try {
        const flights = await FlightServiceModel.getAllFlights();
        res.status(200).json(flights);
    } catch (error) {
        console.error("Error fetching flights:", error);
        res.status(500).json({ error: "An error occurred while fetching flights." });
    }
}


export async function deleteFlight(req, res) {
    try {
        const { flightNumber } = req.params;

        const flight = await FlightMongooseModel.findOneAndDelete({ flightNumber });

        if (!flight) {
            return res.status(404).json({
                status: "FAILED",
                message: "Flight not found"
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "Flight deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            message: error.message || "Internal server error"
        });
    }
}
