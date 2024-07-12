const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const isLoggedIn = require("./src/middleware/isLoggedIn");
const connectDB = require("./db/connectDB");
const notFound = require("./src/middleware/notFound");
const errorHandler = require("./src/middleware/errorHandler");
const logger = require("morgan");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger("dev"));

// Configuración de los proxies para cada microservicio usando variables de entorno
const serviceProxyConfig = {
  "/authentication": process.env.AUTHENTICATION_SERVICE_URL,
  "/users": process.env.USERS_SERVICE_URL,
  "/climate-data": process.env.CLIMATE_DATA_SERVICE_URL,
  "/monitoring-stations": process.env.MONITORING_STATIONS_SERVICE_URL,
  "/alerts-notifications": process.env.ALERTS_NOTIFICATIONS_SERVICE_URL,
  "/download-requests": process.env.DOWNLOAD_REQUESTS_SERVICE_URL,
  "/sensors": process.env.SENSORS_SERVICE_URL,
  "/nodes": process.env.NODES_SERVICE_URL,
  "/configurations": process.env.CONFIGURATIONS_SERVICE_URL,
  "/system-activities": process.env.SYSTEM_ACTIVITIES_SERVICE_URL,
  "/sockets": process.env.SOCKETS_SERVICE_URL,
};

// Rutas públicas
const publicRoutes = ["/authentication/*", "/climate-data/public/*"];

// Función para verificar si una ruta es pública
const isPublicRoute = (path) => {
  return publicRoutes.some((route) => new RegExp(route).test(path));
};

// Middleware para aplicar autenticación solo a rutas privadas
app.use((req, res, next) => {
  if (isPublicRoute(req.path)) {
    next();
  } else {
    isLoggedIn(req, res, next);
  }
});

// Configurar rutas de proxies
Object.keys(serviceProxyConfig).forEach((context) => {
  app.use(
    context,
    createProxyMiddleware({
      target: serviceProxyConfig[context],
      changeOrigin: true,
      pathRewrite: (path) => path.replace(context, ""),
    })
  );
});

app.use("*", notFound);
app.use(errorHandler);

// Iniciar el servidor
app.listen(PORT, async () => {
  console.log(`API Gateway is running on port ${PORT}`);
  await connectDB();
});
