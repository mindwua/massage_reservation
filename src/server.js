const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const routerAccount = require("./routes/account_routes");
app.use("/api/v1/register", routerAccount);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
