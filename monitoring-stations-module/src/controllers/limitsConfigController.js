const getAllLimitsConfigs = async (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

const getLimitsConfigById = async (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

const updateLimitsConfig = async (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

const deleteLimitsConfig = async (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

const createLimitsConfig = async (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLimitsConfigs,
  getLimitsConfigById,
  createLimitsConfig,
  updateLimitsConfig,
  deleteLimitsConfig,
};
