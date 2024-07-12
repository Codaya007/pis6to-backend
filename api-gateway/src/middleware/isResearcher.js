const { BLOQUED_USER_STATUS, RESEARCHER_ROLE_NAME } = require("../constants");
const validateToken = require("../helpers/validateToken");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.header("Autentication");
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

    //! VALIDO QUE SEA ROL researcher
    if (user.role.name !== RESEARCHER_ROLE_NAME) {
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
