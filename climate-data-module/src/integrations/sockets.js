const io = require("socket.io-client");

let socket;

const connectSocket = () => {
  socket = io(`${process.env.API_BASEURL}/ms7`);

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected, attempting to reconnect");
    setTimeout(connectSocket, 1000); // Intentar reconectar cada segundo
  });
};

// Llamar a esta función al iniciar la aplicación
connectSocket();

module.exports = socket;
