import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/mongo_utils.js";
import redisClient from './utils/redis_utils.js';
import logger from "./utils/logger_utils.js";


import routerAccount from "./routes/account_routes.js";
import routerReservation from "./routes/reservation_routes.js";
import routerAuth from './routes/auth_routes.js';
import routerMassageShops from "./routes/massage_shops.js";

import routerFlight from "./routes/flights_routes.js";
import routerSeats from "./routes/seats_routes.js";



dotenv.config({ path: "./src/config/config.env" });
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1", routerAccount, routerReservation, routerMassageShops,
  routerFlight, routerSeats);
app.use("/api/v1/auth", routerAuth);


connectDB(logger);
redisClient.connect();

app.listen(port, () => {
  logger.info(`server started on port ${port}`);
});


export default app;
