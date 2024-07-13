// En el API gateway ya se valida que se haya autenticado y valida el token, aquí solo valido que sí haya usuario
const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401); // No autorizado
  }

  next();
};

module.exports = isLoggedIn;
