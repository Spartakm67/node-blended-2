const express = require("express");
const app = express();
const path = require("path");
const connectDb = require("../config/connectDb");
require("colors");
const errorHandler = require("./midelwares/errorHandler");

const configPath = path.join(__dirname, "..", "config", ".env");

const dotenv = require("dotenv");
dotenv.config({ path: configPath });

const { PORT } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/v1", require("./routers/alcoRouts"));
app.use(errorHandler);

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.blue.bold);
});
