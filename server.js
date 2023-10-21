const express = require("express");
const cors = require("cors");

const dbService = require("./src/services/mongo_datbase_service");

const authenticationRoutes = require("./src/routes/authentication.routes");


require("dotenv").config();
require("dotenv-safe").config();

const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

// ROUTES
// Defualt Route
app.get("/", async function (req, res, next) {
    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: `Welcome to ${process.env.APP_NAME} API`,
    });
  });

  ////////
app.use('/auth', authenticationRoutes);
  /////

  // handle undefined Routes Or ROutes That Doesnt Exist
app.use("*", (req, res, next) => {
    res.status(404).json({
      status: "error",
      statusCode: 404,
      message: "Route not found",
    });
  });
  
// Our Server Port
const PORT = process.env.PORT || 3000;
// Connect To Database
// Start Up Server
dbService.connectToDatabase().then(() => {
  // START SERVER
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server started on port https://127.0.0.1:${PORT}`);
  });
});
