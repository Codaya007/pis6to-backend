const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const isLoggedIn = require("./src/middleware/isLoggedIn");
const connectDB = require("./db/connectDB");
const notFound = require("./src/middleware/notFound");
const errorHandler = require("./src/middleware/errorHandler");
const logger = require("morgan");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(cors());

// Configuración de los proxies para cada microservicio usando variables de entorno
const serviceProxyConfig = {
  "/ms1": process.env.AUTHENTICATION_AND_USERS_SERVICE_URL,
  "/ms2": process.env.MONITORING_STATIONS_SERVICE_URL,
  "/ms3": process.env.CLIMATE_DATA_SERVICE_URL,
  "/ms4": process.env.ALERTS_AND_NOTIFICATIONS_SERVICE_URL,
  "/ms5": process.env.DOWNLOAD_REQUESTS_SERVICE_URL,
  "/ms6": process.env.SYSTEM_ACTIVITIES_SERVICE_URL,
  "/ms7": process.env.SOCKETS_SERVICE_URL,
  "/ms8": process.env.MEDIA_SERVICE_URL,
};

// Rutas públicas
// const publicRoutes = ["/ms1/auth/*", "/ms1/auth/researcher", "/ms3/*"];
const publicRoutes = [
  { path: "/ms1/auth/*", methods: ["POST"] },
  { path: "/ms1/researchers", methods: ["POST"] },
  // Aquí puedes agregar más rutas públicas según tus necesidades
];

app.use((req, res, next) => {
  const isPublic = publicRoutes.some((route) => {
    const pathMatches = new RegExp(`${route.path}`).test(req.path);
    const methodMatches = route.methods
      ? route.methods.includes(req.method)
      : true;
    return pathMatches && methodMatches;
  });

  if (isPublic) {
    next();
  } else {
    isLoggedIn(req, res, next);
  }
});

// // Función para verificar si una ruta es pública
// const isPublicRoute = (path) => {
//   return publicRoutes.some((route) => new RegExp(route).test(path));
// };

// // Middleware para aplicar autenticación solo a rutas privadas
// app.use((req, res, next) => {
//   if (isPublicRoute(req.path)) {
//     next();
//   } else {
//     isLoggedIn(req, res, next);
//   }
// });

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
