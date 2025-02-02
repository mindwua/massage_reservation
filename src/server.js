import express from "express";
import dotenv from "dotenv";
import routerAccount from "./routes/account_routes.js";
import connectDB from "./repo/mongo_repo.js";

dotenv.config({ path: "./src/config/config.env" });
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/register", routerAccount);

connectDB();

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

export default app;
