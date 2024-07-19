const LimitConfig = require("../models/LimitsConfig");

const getAllLimitConfigs = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;
    where.deletedAt = null;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await LimitConfig.countDocuments(where);
    const limitconfigs = await LimitConfig.find(where)
      .skip(skipValue)
      .limit(limitValue);

    return res.status(200).json({
      customMessage: "Límites ambientales obtenidos exitosamente",
      totalCount,
      results: limitconfigs,
    });
  } catch (error) {
    next(error);
  }
};

const getOneLimitConfig = async (req, res, next) => {
  const where = req.params;

  try {
    const limitconfig = await LimitConfig.findOne(where).sort({
      createdAt: -1,
    });

    if (!limitconfig) {
      return next({
        status: 404,
        customMessage: "Límite ambiental no encontrado",
      });
    }

    return res.status(200).json({
      customMessage: "Límite ambiental obtenido exitosamente",
      results: limitconfig,
    });
  } catch (error) {
    next(error);
  }
};

const updateLimitConfig = async (req, res, next) => {
  const { id } = req.params;

  try {
    const limitconfig = await LimitConfig.findById(id);

    if (!limitconfig) {
      return next({
        status: 404,
        customMessage: "Límite ambiental no encontrado",
      });
    }

    await LimitConfig.updateOne({ _id: id }, req.body);

    return res.status(200).json({
      customMessage: "Límite ambiental actualizada exitosamente",
      results: limitconfig,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLimitConfig = async (req, res, next) => {
  const { id } = req.params;

  try {
    const limitconfig = await LimitConfig.findById(id);

    if (!limitconfig || limitconfig.deletedAt !== null) {
      return next({
        status: 404,
        customMessage: "Límite ambiental no encontrado",
      });
    }

    await LimitConfig.updateOne({ _id: id }, { deletedAt: new Date() });

    return res.status(200).json({
      customMessage: "Límite ambiental eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

const createLimitConfig = async (req, res, next) => {
  try {
    const limitconfig = await LimitConfig.create(req.body);

    return res.status(201).json({
      customMessage: "Límite ambiental registrado exitosamente",
      results: limitconfig,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar límite ambiental",
      error: error.message,
    });
  }
};

module.exports = {
  getAllLimitConfigs,
  getOneLimitConfig,
  createLimitConfig,
  updateLimitConfig,
  deleteLimitConfig,
};
