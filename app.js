const express = require("express");
const cors = require("cors");
const app = express();
const UserRouter = require("./routes/User");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

// app.use("/products", ProductRouter);
app.use("/users", UserRouter);

databaseConnection(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
