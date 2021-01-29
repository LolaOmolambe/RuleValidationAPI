const express = require("express");
const validationRoutes = require("./routes/validationRoutes");
const errorHandler = require("./controllers/errorHandler");

const app = express();
app.use(express.json());

app.use("", validationRoutes);
app.use(errorHandler);

module.exports = app;