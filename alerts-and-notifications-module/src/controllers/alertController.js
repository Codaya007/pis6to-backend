const Alert = require("../models/Alert");

const getAllAlerts = async(req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;
    where.deletedAt = null;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await Alert.countDocuments(where);
    const alerts = await Alert.find(where)
      .skip(skipValue)
      .limit(limitValue);

    return res.status(200).json({
      customMessage: "Alertas obtenidos exitosamente",
      totalCount,
      results: alerts,
    });
  } catch (error) {
    next(error);
  }
};

const getAlertById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      return next({
        status: 404,
        customMessage: "Alerta no encontrado",
      });
    }

    return res.status(200).json({
      customMessage: "Alerta obtenida exitosamente",
      results: alert,
    });
  } catch (error) {
    next(error);
  }
};

const resolveAlert = async (req, res, next) => {
  const { id } = req.params;

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      return next({
        status: 404,
        customMessage: "Alerta no encontrado",
      });
    }

    const resultado = await Alert.findByIdAndUpdate(
      id,
      { $set: { resolved: req.body.resolved, 
        resolvedBy: req.body.resolvedBy
        } },
      { new: true } // Opcional: devuelve el documento actualizado
    );
    return res.status(200).json({
      customMessage: "Alerta actualizada exitosamente",
      results: resultado,
    });
  } catch (error) {
    next(error);
  }
}

const muteAlert = async (req, res, next) => {
  const { id } = req.params;

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      return next({
        status: 404,
        customMessage: "Alerta no encontrado",
      });
    }

    // await Alert.updateOne({ _id: id }, req.body);
    const resultado = await Alert.findByIdAndUpdate(
      id,
      { $set: { emitSound: req.body.emitSound } },
      { new: true } // Opcional: devuelve el documento actualizado
    );

    return res.status(200).json({
      customMessage: "Alerta actualizada exitosamente",
      results: resultado,
    });
  } catch (error) {
    next(error);
  }
}

const createAlert = async (req, res, next) => {
  try {
    const alert = await Alert.create(req.body);

    return res.status(201).json({
      customMessage: "Alerta registrada exitosamente",
      results: alert,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar la alerta",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAlerts,
  getAlertById,
  createAlert,
  muteAlert,
  resolveAlert,
};
