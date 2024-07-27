var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Server: SocketServer } = require("socket.io");
const http = require("http");
const cors = require("cors");

var indexRouter = require("./src/routes/index");
const notFound = require("./src/middlewares/notFound");
const errorHandler = require("./src/middlewares/errorHandler");

var app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: "*" },
  transports: ["websocket"], // puedes especificar transportes
  allowEIO3: true, // permitir versiones antiguas de Engine.IO si es necesario
});

// Almacenar la instancia de io en app para que sea accesible en los controladores
app.set("socketio", io);

io.use(async (socket, next) => {
  // if (socket.handshake.auth && socket.handshake.auth.token) {
  // } else {
  //   next();
  // }
  console.log("USO", socket);
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use(notFound);
app.use(errorHandler);

io.listen(5000);

module.exports = app;
