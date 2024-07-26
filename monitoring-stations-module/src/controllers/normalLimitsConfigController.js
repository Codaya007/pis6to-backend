const NormalLimitConfig = require("../models/normalLimitsConfig");

const getAllNormalLimitConfigs = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;
    where.deletedAt = null;

    // Convertir skip y normallimit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await NormalLimitConfig.countDocuments(where);
    const normallimitconfigs = await NormalLimitConfig.find(where)
      .skip(skipValue)
      .normallimit(limitValue);

    return res.status(200).json({
      customMessage: "Límites ambientales normales obtenidos exitosamente",
      totalCount,
      results: normallimitconfigs,
    });
  } catch (error) {
    next(error);
  }
};

const getOneNormalLimitConfig = async (req, res, next) => {
  const where = req.params;
  where.deletedAt = null;

  try {
    const normallimitconfig = await NormalLimitConfig.findOne(where).sort({
      createdAt: -1,
    });

    if (!normallimitconfig) {
      return next({
        status: 404,
        customMessage: "Límite ambiental normal no encontrado",
      });
    }

    return res.status(200).json({
      customMessage: "Límite ambiental normal obtenido exitosamente",
      results: normallimitconfig,
    });
  } catch (error) {
    next(error);
  }
};

const updateNormalLimitConfig = async (req, res, next) => {
  const { id } = req.params;

  try {
    const normallimitconfig = await NormalLimitConfig.findById(id);

    if (!normallimitconfig) {
      return next({
        status: 404,
        customMessage: "Límite ambiental normal no encontrado",
      });
    }

    await NormalLimitConfig.updateOne({ _id: id }, req.body);

    return res.status(200).json({
      customMessage: "Límite ambiental normal actualizada exitosamente",
      results: normallimitconfig,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNormalLimitConfig = async (req, res, next) => {
  const { id } = req.params;

  try {
    const normallimitconfig = await NormalLimitConfig.findById(id);

    if (!normallimitconfig || normallimitconfig.deletedAt !== null) {
      return next({
        status: 404,
        customMessage: "Límite ambiental normal no encontrado",
      });
    }

    await NormalLimitConfig.updateOne({ _id: id }, { deletedAt: new Date() });

    return res.status(200).json({
      customMessage: "Límite ambiental normal eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

const createNormalLimitConfig = async (req, res, next) => {
  try {
    const normallimitconfig = await NormalLimitConfig.create(req.body);

    return res.status(201).json({
      customMessage: "Límite ambiental normal registrado exitosamente",
      results: normallimitconfig,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar límite ambiental normal",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNormalLimitConfigs,
  getOneNormalLimitConfig,
  createNormalLimitConfig,
  updateNormalLimitConfig,
  deleteNormalLimitConfig,
};
