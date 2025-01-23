const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./services/mongodb");

//middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// initialize routes
app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to the API" });
});

//api prefix
const PREFIX = process.env.API_PREFIX || "/api";

console.log(`API prefix: ${PREFIX}`);

// routes
app.use(`${PREFIX}/chat`, require("./router/chat"));

//error handling middleware
app.use((err, req, res, next) => {
  const mode = process.env.NODE_ENV || "development";
  if (mode === "development") {
    console.error(err);
  } else {
    console.error(err.message);
  }
  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .send({ success: false, message: err.message || "Something broke!" });
});

// start the server
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
