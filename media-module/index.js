const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { PORT } = process.env;
const errorHandler = require("./middlewares/errorHandler.js");
const notFound = require("./middlewares/notFound.js");
const mediaRouter = require("./routes/media.routes.js");
const logger = require("morgan");

const app = express();

app.use(cors());
app.use(logger("dev"));

// Middleware para analizar solicitudes con cuerpo JSON
app.use(express.json());

const server = http.createServer(app);

app.use("/media", mediaRouter);
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
