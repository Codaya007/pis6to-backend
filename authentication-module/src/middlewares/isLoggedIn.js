const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.sendStatus(401); // No autorizado
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añadir la información del usuario a la solicitud

    console.log("Middleware ms, decoded: ", decoded);
    next();
  } catch (error) {
    return res.status(401).json({
      customMessage: "Token inválido",
      details: error.message,
    });
  }
};

module.exports = isLoggedIn;
