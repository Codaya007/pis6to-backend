const CustomError = require("../errors/CustomError");

const notFound = (req, res, next) => {
  const error = new CustomError(
    `El recurso solicitado ${req.url} no se encontró`,
    `El recurso solicitado ${req.url} no se encontró`,
    404
  );

  next(error);
};

module.exports = notFound;
