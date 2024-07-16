const jwt = require("jsonwebtoken");
const { BLOQUED_USER_STATUS } = require("../constants");
const validateToken = require("../helpers/validateToken");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.header("Authorization");
    console.log("Autenticando en api gateway: ", bearerToken);
    const user = await validateToken(bearerToken);
    // console.log("Autenticando en api gateway: ", user);

    if (user.deletedAt) {
      return res.status(403).json({
        customMessage:
          "Su usuario fue dado de baja, contáctese con el administrador.",
      });
    }

    if (user.state == BLOQUED_USER_STATUS) {
      return res.status(403).json({
        customMessage: "Usuario bloqueado, contáctese con el administrador.",
      });
    }

    // Generar un nuevo JWT para el usuario autenticado
    const jwtPayload = {
      id: user._id,
      email: user.email,
      roleName: user.role?.name,
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "2000", // 2000 ms o 2 segundos
    });

    // Añadir el token JWT a los encabezados de la solicitud
    req.headers["x-auth-token"] = jwtToken;

    req.user = user;

    return next();
  } catch (error) {
    return res.status(500).json({
      customMessage: "Algo salió mal",
      details: error.message,
    });
  }
};
