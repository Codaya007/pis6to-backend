const errorHandler = async (error, req, res, next) => {
  console.log({ error });

  const status = error.status || 500;
  const customMessage = error.customMessage || "Algo salió mal";
  const details = error.details || error.message || error.error || null;

  res.status(status).json({ customMessage, details });
};

module.exports = errorHandler;
