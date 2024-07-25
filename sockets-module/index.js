const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const SocketServer = require("socket.io").Server;
const { PORT, FRONT_BASEURL } = process.env;
const errorHandler = require("./middlewares/errorHandler.js");
const notFound = require("./middlewares/notFound.js");
const CustomError = require("./errors/CustomError.js");

const app = express();

app.use(cors());

// Middleware para analizar solicitudes con cuerpo JSON
app.use(express.json());

const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: { origin: "*" },
});

//! Middleware de autenticación
io.use(async (socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    // Aquí se añade la validación del token si existe
    next();
  } else {
    // Cuando no se envió autenticación
    next();
  }
});

io.on("connection", (socket) => {
  console.log("Cliente conectado: ", socket.id);

  socket.on(
    "sendAdminNotification",
    async ({ title, content, redirect, type }) => {
      try {
        if (!title) {
          throw new CustomError("El campo title es requerido", null, 400);
        }

        if (!content) {
          throw new CustomError("El campo content es requerido", null, 400);
        }

        const url = redirect
          ? `${FRONT_BASEURL}/${redirect}`
          : `${FRONT_BASEURL}/${redirect}`;

        const socketData = {
          title,
          content,
          url,
          type,
        };

        socket.broadcast.emit(`adminNotifications`, socketData);

        //! Respondo con éxito
        socket.emit("response", {
          success: true,
          message: "Notificacion exitosa",
        });
      } catch (error) {
        console.error("Error in sendAdminNotification: ", error);
        //! Respondo con error
        socket.emit("response", { success: false, message: error.message });
      }
    }
  );

  socket.on(
    "sendNotificationToUser",
    async ({ title, content, type = "error", userId }) => {
      try {
        if (!title) {
          throw new CustomError("El campo title es requerido", null, 400);
        }

        if (!content) {
          throw new CustomError("El campo content es requerido", null, 400);
        }

        const url = redirect
          ? `${FRONT_BASEURL}/${redirect}`
          : `${FRONT_BASEURL}/${redirect}`;

        const socketData = {
          title,
          content,
          type,
          url,
        };

        socket.broadcast.emit(`notifications${userId}`, socketData);

        //! Respondo con éxito
        socket.emit("response", {
          success: true,
          message: "Notificacion exitosa",
        });
      } catch (error) {
        console.error("Error in send notification: ", error);
        //! Respondo con error
        socket.emit("response", { success: false, message: error.message });
      }
    }
  );

  socket.on(
    "sendClimateData",
    async ({ climateData, node, monitoringStation }) => {
      try {
        if (!node) {
          throw new CustomError("El campo title es requerido", null, 400);
        }

        if (!monitoringStation) {
          throw new CustomError("El campo content es requerido", null, 400);
        }

        if (!climateData) {
          throw new CustomError("El campo climateData es requerido", null, 400);
        }

        const socketData = {
          climateData,
          node,
          monitoringStation,
        };

        socket.broadcast.emit(`climateData`, socketData);
        socket.broadcast.emit(`climateDataNode${node}`, socketData);
        socket.broadcast.emit(
          `climateDataMonitoringStation${monitoringStation}`,
          socketData
        );

        //! Respondo con éxito
        socket.emit("response", {
          success: true,
          message: "Datos enviados exitosamente",
        });
      } catch (error) {
        console.error("Error in sendClimateData: ", error);
        //! Respondo con error
        socket.emit("response", { success: false, message: error.message });
      }
    }
  );

  socket.on("alertUpdate", async ({ nodeId, active = false }) => {
    try {
      if (!nodeId) {
        throw new CustomError("El campo nodeID es requerido", null, 400);
      }

      const socketData = {
        node: nodeId,
        active,
      };

      socket.broadcast.emit(`alertNode${nodeId}`, socketData);

      //! Respondo con éxito
      socket.emit("response", {
        success: true,
        message: "Alerta enviada exitosamente",
      });
    } catch (error) {
      console.error("Error en envío de alertas: ", error);
      //! Respondo con error
      socket.emit("response", { success: false, message: error.message });
    }
  });

  socket.on("error", (err) => {
    console.error("Socket.IO error: ", err);
  });
});

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
