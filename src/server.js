import express from "express";
import dotenv from "dotenv";
import routerAccount from "./routes/account_routes.js";
import connectDB from "./utils/mongo_utils.js";
import logger from "./utils/logger_utils.js";

dotenv.config({ path: "./src/config/config.env" });
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1", routerAccount);


// app.use("/api/v1/reservation", routerAccount);

connectDB(logger);

app.listen(port, () => {
  logger.info(`server started on port ${port}`);
});

export default app;
