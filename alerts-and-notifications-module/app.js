var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const socketIo = require("socket.io");
const http = require("http");

var indexRouter = require("./src/routes/index");
const notFound = require("./src/middlewares/notFound");
const errorHandler = require("./src/middlewares/errorHandler");

var app = express();

const server = http.createServer(app);
const io = socketIo(server);

// Almacenar la instancia de io en app para que sea accesible en los controladores
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use("*", notFound);
app.use(errorHandler);

module.exports = app;
