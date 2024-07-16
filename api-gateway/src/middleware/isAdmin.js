const { BLOQUED_USER_STATUS, ADMIN_ROLE_NAME } = require("../constants");
const validateToken = require("../helpers/validateToken");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.header("Authorization");
    const user = await validateToken(bearerToken);

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

    //! VALIDO QUE SEA ROL ADMIN
    if (user.role.name !== ADMIN_ROLE_NAME) {
      return res.status(403).json({
        customMessage: "No tiene acceso a este recurso",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(500).json({
      customMessage: "Algo salió mal",
      details: error.message,
    });
  }
};
