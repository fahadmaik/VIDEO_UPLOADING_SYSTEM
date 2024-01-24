const express = require("express");
const { createConnection } = require("typeorm");
const dataSourceOptions = require("./config/database.connection");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mainRouter = require("./routes/public.routes");
const adminRouter = require("./routes/private.route");
const publicRoutes = require("./routes/public.routes");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", publicRoutes);
app.use("/admin", adminRouter);
createConnection(dataSourceOptions).then(() => {
  console.log("DATABASE CONNECTED");
});

app.get("/", (req, res) => {
  console.log("Test");
  res.send("Test");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
